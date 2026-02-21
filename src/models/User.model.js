import { Schema, model } from "mongoose";
// Instanciar el esquema de la entidad User
const userSchema = new Schema({
    urlimage: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'architect', 'user'],
        default: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required:true,
        trim:true
    },
    telephone: {
        type: String,
        trim: true
    },
    cellphoneNumber: {
        type: String,
        required:true,
        unique: true,
        trim: true
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
}, { timestamps: true });
export default model('User', userSchema);