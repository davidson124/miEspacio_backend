import express from "express";

import { createQuotes, getAllQuotes, patchQuotes, deleteQuotes } from "../controllers/quotes.controller.js";

const router = express.Router();

router.get("/",getAllQuotes);
router.post("/", createQuotes)
router.patch("/:idProject", patchQuotes)
router.delete("/:idproject",deleteQuotes)

export default router; 