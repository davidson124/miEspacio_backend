
import { verifyEncriptedPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.heplper.js";
import { dbGetUserByEmail } from "../services/user.service.js";

const loginUser= async (req,res)=>{
    
    const inputData=req.body;

    //Paso 1: Verificar si el usuario no existe
    const userFound = await dbGetUserByEmail(inputData.email);
    if(!userFound){
            return res.json({ msg: `Usuario no existente. Por favor haga su registro`})
        }
    //Paso 2: Verificar si la contraseña coincide 

    const verifiedPassword=verifyEncriptedPassword(inputData.password, userFound.password)

    if(!verifiedPassword){
        return res.json({message: `Contraseña invalida, intente nuevamente`})
    }

    //Paso 3: Generar credencial digital (token)
    const payload = {
        name: userFound.name,
        email: userFound.email,
        role: userFound.role
    };

    const tokenCreado = generateToken(payload)

    //Paso 4: Eliminar propiedades con datos sensibles 
    const jsonUserFound = userFound.toObject();
    
    delete jsonUserFound.password;

    //Paso 5: Responder al cliente
    res.json({user: jsonUserFound, token: tokenCreado});
}

const renewToken = async (req, res) => {
    const payload = req.payload;
    
    delete payload.iat;
    delete payload.exp;

    //Paso 3: Verificar si el usuario sigue existiendo en la base de datos

    const userFound = await dbGetUserByEmail( payload.email );

    if(!userFound){
        return res.json({ msg: `Usuario no existente. Por favor haga su registro`})
}

   // Paso 4: Generar un nuevo token
    const token = generateToken({
        id: userFound._id,          // Identificador Unico del Usuario, controlar quien hace que en la aplicacion
        name: userFound.name,       // Hola, Fulanito! 
        email: userFound.email,     // Para realizar comunicaciones (anonimas)
        role: userFound.role        // Para informar al frontend sobre la autorizacion que tienen los usuarios para acceder a las diferentes interfaces 
    });

    // Paso 5: Eliminar propiedades con datos sensibles
    //         userFound es un BJSON (JSON Binario)
    const jsonUserFound = userFound.toObject();     // Convertir un BJSON a JSON

    delete jsonUserFound.password;      // Elimina la propiedad 'password' de un JSON

    // Paso 6: Responder al cliente
    res.json({ token, user: jsonUserFound });
}

export {
    loginUser,
    renewToken
}