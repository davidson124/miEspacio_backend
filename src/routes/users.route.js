// Importando la dependencia express usando commonJs
const express = require('express');

const router = express.Router();
// Definicion de rutas

router.get('/',(req, res )=>{
    const users = [
        { "name": "Ana", "age": 34},
        { "name": "David", "age": 39},
        { "name": "Brayan", "age": 23},
        { "name": "Camila", "age": 22},
    ]
    res.json(users);
});
// router.get('/health',(req, res )=>{
//     res.send('<h1>health</h1>');
// });



module.exports = router;