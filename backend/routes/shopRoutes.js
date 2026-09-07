import express from 'express';
import {
  getShops,
  getShopById,
  createShop,
  assignInspectorToShop,
  uploadShopDocuments,
  updateShopDocumentStatus
} from '../controllers/shopController.js';

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShopById);
router.post('/', createShop);
router.patch('/:id/assign-inspector', assignInspectorToShop);
router.post('/:id/documents', uploadShopDocuments);
router.patch('/:id/document-status', updateShopDocumentStatus);

export default router;
