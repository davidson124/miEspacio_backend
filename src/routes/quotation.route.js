import { Router } from "express";
import { getAllQuotes, getQuoteById, updateQuote, createQuote, deleteQuote } from "../controllers/quotation.controller.js";

const router = Router();

router.get('/', getAllQuotes),
router.post('/',createQuote)
router.get('/:quoteId', getQuoteById),
router.patch('/:quoteId',updateQuote)
router.delete('/:quoteId', deleteQuote)


export default router