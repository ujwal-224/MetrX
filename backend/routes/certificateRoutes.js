import express from 'express';
import {
  getCertificates,
  lookupCertificate,
  downloadCertificatePDF,
  issueCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

router.get('/', getCertificates);
router.get('/lookup/:certId', lookupCertificate);
router.get('/:certId/download-pdf', downloadCertificatePDF);
router.post('/issue', issueCertificate);

export default router;
