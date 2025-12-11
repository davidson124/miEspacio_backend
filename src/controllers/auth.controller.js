import { verifyEncriptedPassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.heper.js";
import { dbGetUserByEmail } from "../services/user.service.js";

const loginUser = async (req, res)=> {
    const inputData = req.body;
    //paso 1: Verificar si el usuario no existe
    const userFound = await dbGetUserByEmail(inputData.email);
        if (!userFound){
            return res.json({msg:' ⛔ Usuario no existe, por favor haga su registro 🌐'})
        }

    //Paso 2: Verificar si la contraseña coincide 
    const ismatch = verifyEncriptedPassword(inputData.password, userFound.password);
    if(! ismatch){
        return res.json({msg:'Contraseña invalida'});
    }

    //Paso 3: Generar credencial digital (token)
    const payload = {
        name: userFound.name, //Hola cliente
        email: userFound.email, // correo para realizar comunicaciones anénimas
        role: userFound.role // Permisos según rol
    };

    const token = generateToken(payload)
    //paso 4: Eliminar propiedades sensibles
    const jsonUserFound = userFound.toObject(); //toObject= convierte Bjson a Json
    delete jsonUserFound.password;

    //paso 5: Respondder al cliente
    res.json({token, user:jsonUserFound });
}



export {
    loginUser
}