import { Router } from 'express';
import { calculateTotalSimilarity } from '../controllers/similarity';

const router = Router();

router.get('/get-total-similarity', calculateTotalSimilarity);

export const predictRouter = router;