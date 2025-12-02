import { Schema, model } from "mongoose";

// Instanciar el esquema de la entidad User
const userSchema = new Schema({
        name: {
            type: String,
            required:true,
            trim: true,
        },
        username: {
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            unique:true
        },
        contrasenia: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique:true,
            minlength:9,
            maxlength:12
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        role: {
            type: String,
            uniqrequired: true,
            enun: ['super-admin', 'admin', 'colaborador', 'registered'], 
            default: 'registered'
        },
        isActive: {
            type: Boolean,
            default: false
        }
        // isVerified: { 
        //     code: String,
        //     trim:true
        // }
},{});

const userModel = model(
    // nombre de la colección en singular-
    //Esquema asociadp al modelo.
    'users',
    userSchema
);
export default userModel;