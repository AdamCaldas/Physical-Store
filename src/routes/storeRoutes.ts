import express from 'express';
import { findStores } from '../controllers/storeController';

const router = express.Router();

router.get('/stores', findStores);

export default router;