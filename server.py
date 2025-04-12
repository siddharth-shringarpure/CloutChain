import numpy as np
import pandas as pd
import pickle
import requests
from PIL import Image as PILImage
from io import BytesIO
import torch
from IPython.display import Image
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import math
import subprocess

app = Flask(__name__)
scaler = MinMaxScaler()

subprocess.check_call([ 'pip', 'install', 'git+https://github.com/openai/CLIP.git', '--quiet'])
import clip

with open('text_embedding_pipeline.pk', 'rb') as f:
    text_embedding_pipe = pickle.load(f)
with open('sentiment_pipeline.pk', 'rb') as g:
    sentiment_pipe = pickle.load(g)
with open('ocr.pk', 'rb') as h:
    ocr_pipe = pickle.load(h)
with open('img_embedding_model.pk', 'rb') as i:
    model = pickle.load(i)
with open('img_embedding_preprocess.pk', 'rb') as j:
    preprocess = pickle.load(j)

# defining functions
def ocr_img_from_url(img_url):
    try:
        response = requests.get(img_url, stream=True)
        if response.status_code != 200:
            print(f"Failed to fetch: {img_url} (Status: {response.status_code})")
            return ""

        # Read image as bytes
        img_bytes = response.content
        
        # Use EasyOCR directly with bytes
        result = ocr_pipe.readtext(img_bytes)

        # Extract text with high confidence
        text_result = " ".join(text for _, text, prob in result if prob > 0.5)

        return text_result if text_result else ""

    except Exception as e:
        print(f"Error processing {img_url}: {e}")
        return ""
        
def img_embed_from_url(image_url):
    # Sample image and text data
    response = requests.get(image_url)
    
    # Preprocess image
    image = preprocess(
        PILImage.open(
            BytesIO(response.content)
        )
    ).unsqueeze(0).to("cpu")

    with torch.no_grad():
        image_features = model.encode_image(image)
    image_features /= image_features.norm(dim = -1, keepdim = True)
    return image_features[0]

def text_embed_from_str(text):
    text = str(text)
    embed = text_embedding_pipe(text)[0][0]
    return embed

def get_sentiment(text):
    text = str(text)
    res = sentiment_pipe(text)[0]['label']
    if res == 'LABEL_2':
        return 1
    elif res == 'LABEL_1':
        return 0
    else:
        return -1

# preprocessing functions
def preprocess_obj (obj):
    blank_text_embed = text_embed_from_str('')
    blank_img_embed = img_embed_from_url('https://static.vecteezy.com/system/resources/thumbnails/012/680/916/small/blank-black-cement-wall-texture-for-background-with-copy-space-for-design-free-photo.jpg')
    
    columns_to_normalise = ['totalVolume', 'volume24h', 'marketCap', 'uniqueHolders', 'transferCount']
    obj[columns_to_normalise] = scaler.transform(pd.DataFrame([obj[columns_to_normalise]]))[0]
    
    if obj['name'] is not np.nan and obj['name'] != '':
        obj['name_sentiment'] = get_sentiment(obj['name'])
        obj['name_embed'] = text_embed_from_str(obj['name'])
    elif obj['name'] is np.nan or obj['name'] != '':
        obj['name_sentiment'] = 0
        obj['name_embed'] = blank_text_embed
    
    if obj['description'] is not np.nan and obj['description'] != '':
        obj['description_sentiment'] = get_sentiment(obj['description'])
        obj['description_embed'] = text_embed_from_str(obj['description'])
    elif obj['description'] is np.nan or obj['description'] == '':
        obj['description_sentiment'] = 0
        obj['description_embed'] = blank_text_embed

    # IMPORTANT!!!
    # Change the name to the corresponding image cdn column
    if obj['previewImageUrl'] is not np.nan and obj['previewImageUrl'] != '':
        obj['img_embed'] = img_embed_from_url(obj['previewImageUrl'])
        obj['img_ocr'] = ocr_img_from_url(obj['previewImageUrl'])
    elif obj['previewImageUrl']is np.nan or obj['previewImageUrl'] != '':
        obj['img_embed'] = blank_img_embed
        obj['img_ocr'] = ''

    if obj['img_ocr'] == '':
        obj['img_text_embed'] = blank_text_embed
        obj['img_text_sentiment'] = 0
    
    return obj
    
def preprocess_df (df):
    blank_text_embed = text_embed_from_str('')
    
    blank_img_embed = img_embed_from_url('https://static.vecteezy.com/system/resources/thumbnails/012/680/916/small/blank-black-cement-wall-texture-for-background-with-copy-space-for-design-free-photo.jpg')
    
    columns_to_normalise = ['totalVolume', 'volume24h', 'marketCap', 'uniqueHolders', 'transferCount']
    df[columns_to_normalise] = scaler.fit_transform(df[columns_to_normalise])
    
    df[['name', 'description', 'mediaPreviewUrl']] = df[['name', 'description', 'mediaPreviewUrl']].fillna('')

    df['name_sentiment'] = df['name'].apply(lambda x: 0 if (x == '' or x is np.nan) else get_sentiment(x) )
    df['name_embed'] = df['name'].apply(lambda x: blank_text_embed if (x == '' or x is np.nan) else text_embed_from_str(x))
    
    df['description_sentiment'] = df['description'].apply(lambda x: 0 if (x == '' or x is np.nan) else get_sentiment(x) )
    df['description_embed'] = df['description'].apply(lambda x: blank_text_embed if (x == '' or x is np.nan) else text_embed_from_str(x))

    df['img_embed'] = df['mediaPreviewUrl'].apply(lambda x: blank_img_embed if (x == '' or x is np.nan) else img_embed_from_url(x))
    df['img_ocr'] = df['mediaPreviewUrl'].apply(lambda x: '' if (x == '' or x is np.nan) else ocr_img_from_url(x))
    df['img_text_sentiment'] = df['img_ocr'].apply(lambda x: 0 if (x == '' or x is np.nan) else get_sentiment(x) )
    df['img_text_embed'] = df['img_ocr'].apply(lambda x: blank_text_embed if (x == '' or x is np.nan) else text_embed_from_str(x))

    # Convert timestamps to numerical values
    df['createdAt'] = pd.to_datetime(df['createdAt'])
    T = df['createdAt'].max()  # Latest timestamp
    
    time_diff = (T - df['createdAt']).dt.total_seconds()
    df['time_weight'] = np.exp(-0.001 * (time_diff))

    return df

def sentiment_calculator(sen1, sen2):
    distance = abs(sen1 - sen2)
    if distance == 0:
        return 1
    elif distance == 1:
        return 0.5
    else:
        return 0
        
def calculate_sim(obj1, obj2):
    financial_columns = ['totalVolume', 'volume24h', 'marketCap', 'uniqueHolders', 'transferCount']
    w_sentiment = 0.15
    w_financial = 0.15
    w_embed = 0.1
    
    sen_ocr = sentiment_calculator(obj1['img_text_sentiment'], obj2['img_text_sentiment']) 
    sen_name = sentiment_calculator(obj1['name_sentiment'],obj2['name_sentiment'])
    sen_description = sentiment_calculator(obj1['description_sentiment'],obj2['description_sentiment']) 

    img_embed = cosine_similarity([obj1['img_embed']], [obj2['img_embed']])[0][0]
    name_embed = cosine_similarity([obj1['name_embed']], [obj2['name_embed']])[0][0]
    description_embed = cosine_similarity([obj1['description_embed']], [obj2['description_embed']])[0][0]
    img_text_embed = cosine_similarity([obj1['description_embed']], [obj2['description_embed']])[0][0]
    
    financial_sim = cosine_similarity([obj1[financial_columns]], [obj2[financial_columns]])[0][0]
    sentiment_sim = sen_ocr + sen_name + sen_description
    embed_sim = img_embed + name_embed + description_embed + img_text_embed
    
    total_distance = w_sentiment * (sentiment_sim) + w_embed * (embed_sim)  + w_financial * (financial_sim)
    sentiment_sim = sentiment_sim/3
    embed_sim = embed_sim/4
    return  sentiment_sim, embed_sim, financial_sim, total_distance 
    
# # Example of data, change this in our deployed scenario, data must be in dataframe
# # ALSO: make sure the columns are appropriate to the functions
# df_big = pd.read_csv('Coin.csv')
# df_coin = pd.read_csv('Coin_new.csv')
# example_post = df_big.loc[0].copy()

# df_coin_preprocess = preprocess_df(df_coin)
# example_post_preprocess = preprocess_obj(example_post)




@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df_coin = pd.DataFrame(data['coin_data'])
        example_post = pd.Series(data['example_post'])
        
        df_coin_preprocess = preprocess_df(df_coin)
        example_post_preprocess = preprocess_obj(example_post)
        

        df_coin_preprocess[['sentiment_sim', 'embed_sim', 'financial_sim', 'similarity']] = df_coin_preprocess.apply(
            lambda x: pd.Series(calculate_sim(example_post_preprocess, x)), axis=1
        )
        print("SUKSES MANTAP ANJAY")
        weighted_mean_sentiment_similarity = np.average(df_coin_preprocess['sentiment_sim'], weights=df_coin_preprocess['time_weight'])
        weighted_mean_embed_similarity = np.average(df_coin_preprocess['embed_sim'], weights=df_coin_preprocess['time_weight'])
        weighted_mean_financial_similarity = np.average(df_coin_preprocess['financial_sim'], weights=df_coin_preprocess['time_weight'])
        weighted_mean_similarity = np.average(df_coin_preprocess['similarity'], weights=df_coin_preprocess['time_weight'])

        return jsonify({'weighted_sentiment_similarity': weighted_mean_sentiment_similarity,
                        'weighted_embed_similarity': weighted_mean_embed_similarity,
                        'weighted_financial_similarity': weighted_mean_financial_similarity,
                        'weighted_total_similarity': weighted_mean_similarity})
    except Exception as e:
        return jsonify({'error': str(e)})

model, preprocess = clip.load("ViT-B/32", device = "cpu")
if __name__ == "__main__":
    app.run(debug=True)
