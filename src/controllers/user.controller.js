import { encryptedPassword } from "../helpers/bcrypt.helpers.js";
import { dbDeleteUserById, dbGetAllUserById, dbGetAllUsers, dbGetUserByEmail, dbregisterUser, dbupDateUserById } from "../services/user.service.js";




const createUser = async (req, res )=>{
    try{
        const inputData = req.body;

        //verificar si el usuario existe
        const userFound = await dbGetUserByEmail(inputData.email);
        if (userFound){
            return res.json({msg:' Usuario existente, por favor loguearse'})
        }
        //Paso 2: Encriptar la contraseña
        inputData.password = encryptedPassword ( inputData.password );

        //paso 3: Regitrar al usuario
        const userRegistered = await dbregisterUser( inputData ); //regitrar detos de la DB
        res.json({msg: '🆗 USUARIO CREADO CORRECTAMENTE 👌', userRegistered});
        //paso4: Eliminar propiedades con datos sensibles.
        const jsonUserFound = userRegistered.toObjet();
        delete jsonUserFound.password;

        //paso 5: responder al cliente
        res.json({ user: jsonUserFound })
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