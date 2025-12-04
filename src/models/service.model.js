import {Schema, model} from 'mongoose';

const serviceSchema= new Schema({
    icon:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type: String,
        required:true
    },
    features:{
        type: [String],
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

const serviceModel= model(
    'services',
    serviceSchema
)

export default serviceModel