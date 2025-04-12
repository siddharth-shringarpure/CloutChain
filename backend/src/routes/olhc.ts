import { Router } from 'express';
import { getOLHCData } from '../controllers/olhcController';

const router = Router();

router.get('/', getOLHCData);

export const olhcRouter = router;