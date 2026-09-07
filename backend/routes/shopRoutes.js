import express from 'express';
import {
  getShops,
  getShopById,
  createShop,
  updateShopDocumentStatus
} from '../controllers/shopController.js';

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShopById);
router.post('/', createShop);
router.patch('/:id/document-status', updateShopDocumentStatus);

export default router;
