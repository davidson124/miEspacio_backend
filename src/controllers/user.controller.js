import {     dbDeleteUserById, dbGetAllUserById, dbGetAllUsers, dbregisterUser, dbupDateUserById } from "../services/user.service.js";


const createUser = async (req, res )=>{
    try{
        const inputDataa = req.body;
        const userRegistered = await dbregisterUser( inputDataa ); //regitrar detos de la DB
        res.json({msg: '🆗 USUARIO CREADO CORRECTAMENTE 👌', userRegistered});
    }
    catch(error){
        console.error(error);
        res.json({
            msg:' ❌ ERROR: ❌ ⚠️ NO HEMOS PODIDO CREAR USUARIO ⚠️'
        });
};
}   
const getAllUsers = async (req, res) => {
    try{
        const users = await dbGetAllUsers();
        res.json({
        msg:'🕑 BUSCANDO USUARIOS...',users
    });
    }
    catch(error){
        res.json({
        msg:'⚠️ ⛔ ERROR EN LA BUSQUEDA, INTENTA NUEVAMENTE ⛔ ⚠️'
    });
    };
};
const getUserById = async (req, res) =>{
    try {
        const id = req.params.id;

        const userFound = await dbGetAllUserById(id);
        res.json({
            msg:'🕑 BUSCANDO USUARIO...',userFound
        });
    }
    catch(error){
        res.json({
            msg:'⚠️ ⛔ USUARIO NO ENCINTRADO ⛔ ⚠️'
         });
    }
}
const deleteUserById = async ( req, res )=>{
    try{
            const id = req.params.id;
            const userDelete = await dbDeleteUserById(id);
            res.json({
                msg:' ✂️ USUARIO ELIMINADO ✂️ ',userDelete 
            })
        }
    catch(error){
        console.error(error);
        res.json({
                msg:'⚠️ NO SE HA PODIDO BOORAR EL USUARIO ⚠️'
            })
    }
}
const upDateUserById = async (req, res) =>{
    try{
            const inputData =req.body;
            const id = req.params.id;
            const userUpDated = await dbupDateUserById(id, inputData);
            // const userUpDated = await userModel.findOneAndUpdate({ _id, inputData});
            res.json({
                msg:' ✅✅ LOS DATOS SE HAN MODIFICADO EXITOSAMENTE 👌👌 ',userUpDated

            })
    }catch(error){
                res.json({
                msg:'⚠️ NO SE HA PODIDO MODIFICAR LOS DATOS DEL USUARIO ⚠️'
            })
    }; 
}
export { createUser, 
        getAllUsers,
        getUserById,
        deleteUserById,
        upDateUserById
     };