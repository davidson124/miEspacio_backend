import { verifyEncriptedPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.heplper.js";
import { dbGetUserByEmailWithPassword, dbGetUserById } from "../services/user.service.js";
const loginUser= async (req,res)=>{
    try{
        const { email, password } = req.body;
        //Paso 1: Verificar si el usuario no existe
        const userFound = await dbGetUserByEmailWithPassword(email);
        if(!userFound){
            return res.status(401).json({ message: 'Credenciales invalidas, intente nuevamente'});
            }
        // Verificar si el usuario esta activo
        if(!userFound.isActive){
            return res.status(401).json({ message: 'Usuario inactivo, por favor contacte al administrador'});
        }
        //Paso 2: Verificar si la contraseña coincide 
        const isMatch = await verifyEncriptedPassword(password, userFound.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Credenciales invalidas, intente nuevamente' });
        }
        //Paso 3: Generar credencial digital (token)
        const token = generateToken({
            id: userFound._id, 
            role: userFound.role // Identificador Unico del Usuario, controlar quien hace que en la aplicacion
        });
        const userObject = userFound.toObject();
        //Paso 4: Eliminar propiedades con datos sensibles 
        delete userObject.password;
        res.json({ user: userObject, token });
    }catch(error){
        res.status(500).json({ message: `Error interno del servidor`});
    }
};
const renewToken = async (req, res) => {
    try{
        const { id } = req.payload;
    //Paso 3: Verificar si el usuario sigue existiendo en la base de datos
    const userFound = await dbGetUserById( id );
    if(!userFound || !userFound.isActive){
        return res.status(401).json({ message: 'token no válido'});
    }
   // Paso 4: Generar un nuevo token
    const token = generateToken({
        id: userFound._id,      
        role: userFound.role      
    });
    const userObject = userFound.toObject(); // Convertir un BJSON a JSON
    // Paso 5: Eliminar propiedades con datos sensibles  
    delete userObject.password; // Elimina la propiedad 'password' de un JSON
    // Paso 6: Responder al cliente
    res.json({ token, user: userObject });
    }catch(error){
        res.status(500).json({ message: `Error interno del servidor`});
    }
};
export { loginUser, renewToken } 