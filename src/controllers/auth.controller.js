
import { verifyEncriptedPassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.heplper.js";
import { dbGetUserByEmail } from "../services/user.service.js";

const loginUser = async (req, res) => {
    try {
        const inputData = req.body;

        //Paso 1: Verificar si el usuario no existe
        const userFound = await dbGetUserByEmail(inputData.email);
        if (!userFound) {
            return res.status(404).json({ msg: `Usuario no existente. Por favor haga su registro` })
        }

        //Paso 2: Verificar si la contraseña coincide (Añadido await)
        const verifiedPassword = await verifyEncriptedPassword(inputData.password, userFound.password);

        if (!verifiedPassword) {
            return res.status(401).json({ msg: `Contraseña invalida, intente nuevamente` })
        }

        //Paso 3: Generar credencial digital (token)
        const payload = {
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role
        };

        const tokenCreado = generateToken(payload)

        //Paso 4: Eliminar propiedades con datos sensibles 
        const jsonUserFound = userFound.toObject();
        delete jsonUserFound.password;

        //Paso 5: Responder al cliente
        res.json({ user: jsonUserFound, token: tokenCreado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor al iniciar sesión' });
    }
}

const renewToken = async (req, res) => {
    try {
        const payload = req.payload;

        //Paso 3: Verificar si el usuario sigue existiendo en la base de datos
        const userFound = await dbGetUserByEmail(payload.email);

        if (!userFound) {
            return res.status(404).json({ msg: `Usuario no existente. Por favor haga su registro` })
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al renovar el token' });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userFound = await dbGetUserByEmail(email);

        if (!userFound) {
            return res.status(404).json({ msg: 'No se encontró un usuario con ese correo electrónico' });
        }

        // Simulación de envío de correo
        console.log(`Simulando envío de recuperación a ${email}`);

        res.json({ msg: 'Se ha enviado un correo de recuperación (Simulado)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar la solicitud de recuperación' });
    }
}

export {
    loginUser,
    renewToken,
    forgotPassword
}