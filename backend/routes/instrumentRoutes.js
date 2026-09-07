import express from 'express';
import { getInstruments, registerInstrument } from '../controllers/instrumentController.js';

const router = express.Router();

router.get('/', getInstruments);
router.post('/', registerInstrument);

export default router;
