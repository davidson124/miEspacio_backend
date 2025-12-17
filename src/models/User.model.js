import { Schema, model } from "mongoose";

// Instanciar el esquema de la entidad User
const userSchema = new Schema({
<<<<<<< HEAD
    urlimage: {
        type: String,
        required: false,
        unique: false
    },
    role: {
        type: String,
        uniqrequired: true,
        enun: ['admin', 'user', 'registered'],
        default: 'registered'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required:true,
        trim:true,
    },
    telephone: {
        type: Number,
        required: false,
        trim: true,
        unique: false,
        minLength: 6,
        maxLength: 12
    },
    cellphoneNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 12
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
        unique: true,
        minLength: 9,
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {});
const userModel = model(
    'users',
    userSchema
=======
        urlimage: {
            type: String,
            required: false,
            unique:false
        },
        role: {
            type: String,
            unique:true,
            required: true,
            enun: ['admin', 'user', 'registered'], 
            default: 'registered'
        },
        name: {
            type: String,
            required:true,
            trim: true,
        },
        telephone: {
            type: Number,
            required:false,
            trim:true,
            unique:false,
            minlength:6,
            maxlength:12
        },
        cellphoneNumber:{
            type:Number,
            required:true,
            unique:true,
            trim:true,
            minlength:6,
            maxlength:12
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
            lowercase: true,
            unique:true,
            minlength:9,
            maxlength:12
        },
        telephone: {
            type: Number,
            required:false,
            trim:true,
            unique:false
        },
        isActive: {
            type: Boolean,
            default: false
        }

},{});
const userModel = model(
    'users',
     userSchema
>>>>>>> feature/documentations
);
export default userModel;