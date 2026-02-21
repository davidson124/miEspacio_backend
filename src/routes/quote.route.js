import express from "express";
import {
  createQuotes,
  getAllQuotes,
  patchQuotes,
  deleteQuotes
} from "../controllers/quotes.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.get("/", authenticationUser, getAllQuotes);
router.post("/", createQuotes); // Público para prospectos
router.patch("/:idProject", authenticationUser, patchQuotes);
router.delete("/:idProject", authenticationUser, deleteQuotes);

export default router;

