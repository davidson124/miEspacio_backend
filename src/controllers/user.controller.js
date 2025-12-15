import { encryptedPassword } from "../helpers/bcrypt.helper.js";
import { dbDeleteUserById, dbGetAllUserById, dbGetAllUsers, dbGetUserByEmail, dbregisterUser, dbupDateUserById } from "../services/user.service.js";


const createUser = async (req, res )=>{
    return res.json({ msg:'hola'})

    try{
        const inputData = req.body;
        
        // Paso 1: Verificar si el usuario existe
        //const userFound = await dbGetUserByEmail(inputData.email);

        if( userFound ){
            return res.json({ msg: `No se puede registrar. El usuario ya existe`})
        }

        
        //Paso 2: Encriptar la contraseña que envio el usuario
        inputData.password = await encryptedPassword(inputData.password); // Devuelve el password encriptado

        //Paso 3: Registrar el usuario
        const userRegistered = await dbregisterUser( inputData ); //registrar datos de la DB

        //Paso 4: Borrar informacion sensible

        const jsonUserRegistered = userRegistered.toObject();
        //Transforma un BSON en un JSON para eliminar campos sensibles

        delete jsonUserRegistered.password;

        //Paso 5: Mostrar Informacion

        res.json({msg: '🆗 USUARIO CREADO CORRECTAMENTE 👌', jsonUserRegistered});
    }
    catch(error){
        console.error(error);
        res.json({
            msg:' ❌ ERROR: ❌ ⚠️ NO HEMOS PODIDO CREAR USUARIO ⚠️'
        });
};
}; 
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
};
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
};
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
};

export { createUser, 
        getAllUsers,
        getUserById,
        deleteUserById,
        upDateUserById
    };