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
router.put('/users',(req, res )=>{
    res.json({msg: 'modificar un objeto'});
});
router.patch('/users',(req, res )=>{
    res.json({msg: 'modificar parcialmente un objeto'});
});
router.delete('/users',(req, res )=>{
    res.json({msg: 'eliminar un objeto'});
});




export default router;