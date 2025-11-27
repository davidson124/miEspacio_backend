const express = require('express');

const router = express.Router();

router.get('/health', (req, res)=>{
    const salud = [
        {"producto": "crema", "nombre": "tutu"},
        {"producto": "tableta", "nombre": "acetam"},
        {"producto": "tópico", "nombre": "betam"},
        {"producto": "inyeccion", "nombre": "diclo"}
    ]
    res.json(salud);
});

module.exports=router;