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
    },
    serviceType:{
        type: String,
        enum:["Diseño Arquitectonico", "Remodelacion", "Diseño de Interiores", "Gestion de Proyectos", "Consultoria"],
        default: "Selecciona un servicio",
        required: true
    }
},{timestamps:true})

const serviceModel= model(
    'services',
    serviceSchema
)

export default serviceModel