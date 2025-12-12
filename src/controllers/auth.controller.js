import { json } from "express";
import { verifyEncriptedPassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.heper.js";
import { dbGetUserByEmail } from "../services/user.service.js";

const loginUser = async (req, res) => {
    const inputData = req.body;

    //paso 1: Verificar si el usuario no existe
    const userFound = await dbGetUserByEmail(inputData.email);
    if (!userFound){
        return res.json({msg:' ⛔ Usuario no existe, por favor haga su registro 🌐'})
    }
    
    //Paso 2: Verificar si la contraseña coincide 
    const ismatch = verifyEncriptedPassword(inputData.password, userFound.password);

    if(!ismatch){
        return res.json({msg:'Contraseña invalida'});
    }

    //Paso 3: Generar credencial digital (token)
    const payload = {
        id: userFound._id, // Identificador único del usuario
        name: userFound.name, //Hola cliente
        email: userFound.email, // correo para realizar comunicaciones anénimas
        role: userFound.role // Permisos según rol

    };

    const token = generateToken( payload );

    //paso 4: Eliminar propiedades sensibles
    const jsonUserFound = userFound.toObject(); //toObject= convierte Bjson a Json
    delete jsonUserFound.password;

    //paso 5: Respondder al cliente
    res.json({ token, user: jsonUserFound });

}
 const reNewToken = async ( req, res )=>{
    //extraer payLoad del objeto requests que se asigno desde el middleware authenticación
    const payLoad = req.payload;

    //Paso2: Eliminar propiedades innecesarias para ell usuario
    delete payLoad.iat;
    delete payLoad.exp;

    // Paso 3: verificar si el usuario sigue existiendo en l base de datos
    const userFound = await dbGetUserByEmail(payLoad.email);
    if(!userFound){

        return res.json({msg:'Usuario ya no existe, NO puede renovar el token'});
    }
    //Paso 4: Generar un nuevo token
    const token = generateToken({
         id: userFound._id,
         name: userFound.name,
         email: userFound.email,
         role: userFound.role
    });

    const jsonUserFound = userFound.toObject();//userFound es bjson y se cambia a json
    
    delete jsonUserFound.password;//paso 5: Eliminar propiedades de datos sensibles

    res.json({ token, user: jsonUserFound });

}


export {
    loginUser,
    reNewToken
}