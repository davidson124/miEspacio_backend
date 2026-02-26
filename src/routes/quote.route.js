import { Router } from "express";
import  isAdmin from "../middlewares/authorization.middleware.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import {
  createQuote,
  getMyquotes,
  updateQuoteAdmin,
  generateQuotePDF,
  getAllQuotesAdmin,
  archiveQuoteAdmin,
  generateProposal
} from "../controllers/quotes.controller.js";

const router = Router();
//Usuario autenticado puede crear cotización
router.post("/", authenticationUser, createQuote);
router.get("/me", authenticationUser, getMyquotes);
//Solo admin puede ver todas las cotizaciones
router.get("/", authenticationUser, isAdmin, getAllQuotesAdmin);
router.patch("/:id", authenticationUser, isAdmin, updateQuoteAdmin);
router.delete("/:id", authenticationUser, isAdmin, archiveQuoteAdmin);
router.get("/:id/pdf", authenticationUser, isAdmin, generateQuotePDF);
router.patch("/:id/proposal", authenticationUser, isAdmin,generateProposal);
export default router;

