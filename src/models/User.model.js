import { Schema, model } from "mongoose";

// Instanciar el esquema de la entidad User
const userSchema = new Schema({

    urlimage: {
        type: String,
        required: false,
        unique: false
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'registered'],
        default: 'registered'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
    },
    telephone: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
    },
    cellphoneNumber: {
        type: Number,
        required: false,
        unique: false,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {});
const userModel = model(
    'users',
    userSchema
)

export default userModel;