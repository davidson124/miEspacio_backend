import { Router } from 'express';
import { createBilling, getAllBilling, getBillingById } from '../controllers/billing.controller.js';

const router = Router();


router.get("/", getAllBilling);
router.post('/', createBilling);
router.get('/:id', getBillingById);

export default router;