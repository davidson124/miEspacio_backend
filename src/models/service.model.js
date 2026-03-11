import {Schema, model} from 'mongoose';

const imageSchema = new Schema ({
    url: { type:String, required:true, trim:true },
    thumbUrl: { type: String, trim:true },
    publicId: { type:String, trim:true }
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
        trim: true
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
export default model( 'Service', serviceSchema );