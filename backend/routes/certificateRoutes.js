import express from 'express';
import {
  getCertificates,
  lookupCertificate,
  issueCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

router.get('/', getCertificates);
router.get('/lookup/:certId', lookupCertificate);
router.post('/issue', issueCertificate);

export default router;
