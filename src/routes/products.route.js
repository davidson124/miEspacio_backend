import express from "express";

const router = express.Router();


router.get('/products',(req, res)=>{
    res.send('<h1>Productos</h1>');
});

export default router;