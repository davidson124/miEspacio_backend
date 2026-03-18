import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyEncriptedPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.heplper.js";
import { dbGetUserByEmailWithPassword, dbGetUserById } from "../services/user.service.js";
export const loginUser= catchAsync(async (req,res)=>{
        const { email, password } = req.body;
        //Paso 1: Verificar si el usuario no existe o Verificar si el usuario esta activo
        const userFound = await dbGetUserByEmailWithPassword(email);
        if(!userFound || !userFound.isActive){
            throw new AppError('Credenciales invalidas, intente nuevamente', 401);
            }
        //Paso 2: Verificar si la contraseña coincide 
        const isMatch = await verifyEncriptedPassword(password, userFound.password);
        if(!isMatch){
            throw new AppError('Credenciales invalidas, intente nuevamente', 401);
        }
        //Paso 3: Generar credencial digital (token)
        const token = generateToken({
            id: userFound._id, 
            role: userFound.role // Identificador Unico del Usuario, controlar quien hace que en la aplicacion
        });
        const userObject = userFound.toObject();
        //Paso 4: Eliminar propiedades con datos sensibles 
        delete userObject.password;
        res.status(200).json({ message: 'Bienvenido', user: userObject, token
        })
});
export const renewToken = catchAsync(async (req, res) => {
    const { id } = req.payload;
    //Paso 3: Verificar si el usuario sigue existiendo en la base de datos
    const userFound = await dbGetUserById( id );
    if(!userFound || !userFound.isActive){
        throw new AppError('Usuario no encontrado.', 404);
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
    res.status(200).json({
        message: 'Token renovado.',
        user: userObject,
        token
    });
});
export const getMe = catchAsync(async (req, res) => {
    const { id } = req.payload;
    const userFound = await dbGetUserById(id);
    if (!userFound || !userFound.isActive) {
      throw new AppError("Usuario no encontrado.", 404);
    }
    const userObject = userFound.toObject();
    delete userObject.password;
    return res.status(200).json({ message: "Perfil obtenido correctamente.", user: userObject
    });
});