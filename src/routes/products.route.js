import express from "express";
import { createProduct, deleteProductById, getProductById, getProducts } from "../controllers/products.controller.js"; 

const router = express.Router();


router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:idProduct', getProductById) //Parametrizar la ruta
router.delete('/:idProduct',deleteProductById )

export default router;