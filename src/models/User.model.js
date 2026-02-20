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
    lastName:{
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
        minlength: 9,
        select: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timeseries: true });
export default model('User', userSchema);