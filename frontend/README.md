# CloutChain

## 🚀 Project Description

CloutChain is an advanced analytics platform that predicts the **virality** of Zora coins. The platform leverages **powerful attention models** to assign virality scores to coins — helping traders identify them before they gain widespread attention. Users can filter new/trending posts by virality score, visualise market data, and set up trading thresholds based on virality metrics. The platform combines **social media sentiment analysis** with historical price patterns to generate **actionable investment recommendations**, facilitating informed trading activities.

## 📊 Project Overview

CloutChain consists of three main components:

1. **Virality Prediction Engine**: AI models that score Zora content based on likelihood to become viral
2. **Frontend Dashboard**: Interactive application with filters for trending posts and virality thresholds
3. **Trading Automation**: System that enables users to set buy/sell parameters based on virality scores

Users can explore trending content, and set custom virality thresholds for trading actions.

## 🔌 Sponsor Technology Usage

Our project integrates Zora technology through the `@zoralabs/coins-sdk` package to access real-time token data and content information. We analyse Zora content for **virality prediction**, track token movements, and provide users with actionable insights — specifically optimised for the Zora ecosystem. This integration allows our platform to identify potentially viral content early and forecast market movements based on **social engagement patterns**.

## 🔧 Setup/Installation Instructions

1. Clone the repository: `git clone git@github.com:siddharth-shringarpure/CloutChain.git`
2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   cd backend && npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env` in each directory)
4. Start the development servers:
   ```
   # In separate terminals
   cd frontend && npm run dev
   cd backend && npm run dev
   ```
5. Open http://localhost:3000 in your browser

## 💻 Technologies Used

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion, wagmi, ethers
- **Backend**: Node.js, Express, Prisma
- **AI**: Flask (Python)
- **Blockchain**: Zora SDK, MetaMask Integration

## 📷 Screenshots
