import { encryptedPassword } from "../helpers/bcrypt.helper.js";
import { dbDeleteUserById, dbGetUserById, dbGetAllUsers, dbGetUserByEmail, dbUpdateUserById,dbRegisterUser } from "../services/user.service.js";
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
const createUser = catchAsync(async (req, res) => {
        const { name, lastName, email, password, telephone, cellphoneNumber, urlimage } = req.body;
        if (!name || !lastName || !email || !password) {
            throw new AppError("Faltan datos obligatorios.", 400);
        }
         // Normalizar el correo electrónico a minúsculas
        const normalizedEmail = email.toLowerCase();
        // Paso 1: Verificar si el usuario existe
        const userFound = await dbGetUserByEmail(normalizedEmail);
        if (userFound) {
            throw new AppError("El usuario ya existe.", 400);
        }
        //Paso 2: Encriptar la contraseña que envio el usuario
        const hashedpassword = await encryptedPassword(password);
        //Paso 3: Crear objeto controlado
        const newUser = {
            name,
            lastName,
            email: normalizedEmail,
            password: hashedpassword,
            telephone,
            cellphoneNumber,
            urlimage,
            role: 'user'
        } 
        //Paso 4: Guardar en la base de datos
        const userRegistered = await dbRegisterUser(newUser);
        const jsonUser = userRegistered.toObject();
        delete jsonUser.password;
        //Paso 5: Mostrar Informacion
        res.status(201).json({ 
            message: 'Usuario creado correctamente.', 
            user: jsonUser
        });
    });
const createArchitect = catchAsync(async (req, res) => {
        const { name, lastName, email, password, telephone, cellphoneNumber, urlimage } = req.body;
        if (!name || !lastName || !email || !password) {
            throw new AppError("Faltan datos obligatorios.", 400);
        }
        const normalizedEmail = email.toLowerCase();
        const userFound = await dbGetUserByEmail(normalizedEmail);
        if (userFound) {
           throw new AppError("El usuario ya existe.", 400);
        }
        const hashedpassword = await encryptedPassword(password);
        const newArchitect = {
            name,
            lastName,
            email: normalizedEmail, 
            password: hashedpassword,
            telephone,
            cellphoneNumber,
            urlimage,
            role: 'architect'
        };
        const architectCreated = await dbRegisterUser(newArchitect);
        const jsonUser = architectCreated.toObject();
        delete jsonUser.password;
        res.status(201).json({
            message: 'Usuario creado correctamente.',
            user: jsonUser
        });
});
const getAllUsers = catchAsync(async (req, res) => {
        const users = await dbGetAllUsers();
        res.status(200).json({ message: 'Usuarios obtenidos correctamente.', users });
});
const getUserById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const userFound = await dbGetUserById(id);
        if(!userFound) {
            throw new AppError('Usuario no encontrado.', 404);
        }
        return res.status(200).json({
            message: 'Usuario encontrado.', 
            user: userFound
        });
});
const deleteUserById = catchAsync(async (req, res) => {
        const {id} = req.params;
        const userDelete = await dbDeleteUserById(id);
        if(!userDelete) {
            throw new AppError('Usuario no encontrado.', 404);
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
});
const updateUserById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const allowedFields = ['name', 'lastName', 'email', 'password', 'telephone', 'cellphoneNumber', 'urlimage'];
        const updates = {};
        for (let key of allowedFields) {
            if ( req.body[key] !== undefined ) {
                updates[key] = req.body[key];
            }
        }
        if( Object.keys(updates).length === 0 ) {
            throw new AppError('No se proporcionaron campos para actualizar.', 400);
        }
        if( updates.email ) {
            updates.email = updates.email.toLowerCase();
            const existingUser = await dbGetUserByEmail(updates.email);
            if (existingUser && existingUser._id.toString() !== id) {
                throw new AppError('El correo electrónico ya está en uso por otro usuario.', 400);
            }
        }
        if( updates.password ){
            updates.password = await encryptedPassword(updates.password);
        }
        const userUpDated = await dbUpdateUserById(id, updates);
        if(!userUpDated) {
            throw new AppError('Usuario no encontrado.', 404);
        }
        const jsonUser = userUpDated.toObject();
        delete jsonUser.password;
        res.status(200).json({ 
            message: 'Usuario actualizado correctamente.', 
            user: jsonUser
        });
});
export { createArchitect, createUser, getAllUsers, getUserById, deleteUserById, updateUserById };

