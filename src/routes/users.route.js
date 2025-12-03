// Importando la dependencia express usando commonJs
import express from 'express';

const router = express.Router();
// Definicion de rutas

router.get('/users',(req, res )=>{
    const users = [
        { "name": "Ana", "age": 34},
        { "name": "David", "age": 39},
        { "name": "Brayan", "age": 23},
        { "name": "Camila", "age": 22},
    ]
    res.json(users);
});
router.post('/users',(req, res )=>{
    res.json({msg: 'crear un objeto'});
});





export default router;