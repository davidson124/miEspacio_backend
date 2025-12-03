import {     dbGetAllUserById, dbGetAllUsers, dbregisterUser } from "../services/user.service.js";
import userModel from "../models/User.model.js";

const createUser = async (req, res )=>{
    try{
    
        const data = req.body;

        const dataRegistered = await     dbregisterUser( data ); //regitrar detos de la DB

        res.json({msg: 'crear un objeto', dataRegistered});
    }
    catch(error){
        console.error(error);
        res.json({
            msg:'Error: No se puede crear el usuario'
        });
};
}   
const getAllUsers = async (req, res) => {
    try{
        const users = await dbGetAllUsers();
        res.json({
        msg:'Obteniendo usuario',users
    });
    }
    catch(error){
        res.json({
        msg:'Error en la busqueda'
    });
    };

    

};
const getUserById = async (req, res) =>{
    try {
        const id = req.params.id;

        const user = await dbGetAllUserById(id);

        res.json({
            user
         });
    }
    catch(error){
        res.json({
            msg: 'Error: No s epudo obtener usuario'
         });
    }
    
    
}

export { createUser, 
        getAllUsers,
        getUserById
     };