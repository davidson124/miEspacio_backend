import { encryptedPassword } from "../helpers/bcrypt.helper.js";
import { dbDeleteUserById, dbGetUserById, dbGetAllUsers, dbGetUserByEmail, dbUpdateUserById,dbRegisterUser } from "../services/user.service.js";
const createUser = async (req, res) => {
    try {
        const { name, lastName, email, password, telephone, cellphoneNumber, urlimage } = req.body;
        const inputData = { name, lastName, email, password, telephone, cellphoneNumber, urlimage };
        // Paso 1: Verificar si el usuario existe
        const userFound = await dbGetUserByEmail(email);
        if (userFound) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }
        //Paso 2: Encriptar la contraseña que envio el usuario
        const hashedpassword = await encryptedPassword(password);
        //Paso 3: Crear objeto controlado
        const newUser = {
            name,
            lastName,
            email,
            password: hashedpassword,
            telephone,
            cellphoneNumber,
            urlimage,
            role: 'user'
        } 
        const userRegistered = await dbRegisterUser(newUser);
        const jsonUserRegistered = userRegistered.toObject();
        delete jsonUserRegistered.password;
        //Paso 5: Mostrar Informacion
        res.status(201).json({ 
            message: 'Usuario creado correctamente.', 
            user: jsonUserRegistered
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor.'
        });
    }
};
const createArchitect = async (req, res) => {
    try {
        const { name, lastName, email, password, telephone, cellphoneNumber, urlimage } = req.body;
        const userFound = await dbGetUserByEmail(email);
        if (userFound) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }
        const hashedpassword = await encryptedPassword(password);
        const newArchitect = {
            name,
            lastName,
            email, 
            password: hashedpassword,
            telephone,
            cellphoneNumber,
            urlimage,
            role: 'architect'
        };
        const architectCreated = await dbRegisterUser(newArchitect);
        const jsonArchitect = architectCreated.toObject();
        delete jsonArchitect.password;
        res.status(201).json({
            message: 'Arquitecto creado correctamente.',
            architect: jsonArchitect
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error interno del servidor.'
        });
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await dbGetAllUsers();
        res.json({
            message: 'Buscando usuarios...', users
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Usuario no encontrado'
        });
    };
};
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userFound = await dbGetUserById(id);
        res.json({
            message: 'Buscando usuario...', userFound
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error encontrando usuario.'
        });
    }
};
const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userDelete = await dbDeleteUserById(id);
        res.json({
            message: 'Usuario eliminado.', userDelete
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error eliminando usuario.'
        })
    }
};
const upDateUserById = async (req, res) => {
    try {
        const inputData = req.body;
        const id = req.params.id;
        const userUpDated = await dbUpdateUserById(id, inputData);
        // const userUpDated = await userModel.findOneAndUpdate({ _id, inputData});
        res.json({
            message: 'Datos modificados.', userUpDated
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error actualizando usuario.'
        })
    };
};
export { createArchitect, createUser, getAllUsers, getUserById, deleteUserById, upDateUserById };

