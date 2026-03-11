import { Router } from "express";
import isAdmin from "../middlewares/authorization.middleware.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import { createQuote, getMyQuotes, getAllQuotesAdmin, getQuoteById, generateProposal, generateQuotePDF, updateQuoteAdmin, archiveQuoteAdmin, acceptQuote } from "../controllers/quotes.controller.js";

const router = Router();
//Todas las rutas de quotes requieren usuario autenticado
router.use(authenticationUser);
//CLIENTE
router.post("/", createQuote);
router.get("/my", getMyQuotes);
router.get("/:id/pdf", generateQuotePDF);
router.get("/:id", getQuoteById);
router.patch("/quotes/:id/accept", acceptQuote);
//ADMIN
router.get("/", isAdmin, getAllQuotesAdmin);
router.patch("/:id/proposal", isAdmin, generateProposal);
router.patch("/:id/archive", isAdmin, archiveQuoteAdmin);
router.patch("/:id", isAdmin, updateQuoteAdmin);

export default router;