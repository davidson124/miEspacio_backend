import {Schema, model} from 'mongoose';

const imageSchema = new Schema ({
    url: { type:String, required:true },
    thumbUrl: { type: String     },
    publicId: { type:String }
},{ _id: false });

const serviceSchema= new Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    description:{
        type: String,
        required:true, 
        trim: true
    },
    features:[{
        type: String,
        required:true
    }],
    image:{
        type: imageSchema
    },
    order:{
        type:Number,
        default:0
    },
    //Permitir ocultar servicios
    isActive:{
        type:Boolean,
        default:true,
        index:true
    }
},{timestamps:true})
export default model( 'Services', serviceSchema );