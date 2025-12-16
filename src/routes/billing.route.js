import { Router } from 'express';
import { createBilling, deletebillingById, getAllBilling, getBillingById, upDatebillingById } from '../controllers/billing.controller.js';

const router = Router();


router.get("/", getAllBilling);
router.post('/', createBilling);
router.get('/:id', getBillingById);
router.delete('/:id', deletebillingById);
router.patch('/:id', upDatebillingById);

export default router;