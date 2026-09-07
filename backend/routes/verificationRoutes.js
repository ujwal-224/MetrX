import express from 'express';
import {
  getVerifications,
  createVerification,
  updateVerificationStep
} from '../controllers/verificationController.js';

const router = express.Router();

router.get('/', getVerifications);
router.post('/', createVerification);
router.patch('/:id/step', updateVerificationStep);

export default router;
