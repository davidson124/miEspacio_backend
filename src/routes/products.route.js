import express from "express";
import { createProduct, deleteProductById, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js"; 

const router = express.Router();


router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:idProduct', getProductById) //Parametrizar la ruta
router.delete('/:idProduct',deleteProductById )
router.patch('/:idProduct', updateProduct)

export default router;