import { Schema, model, trusted } from "mongoose";

const documentatiosShema = new Schema({
    urlImg:{
        type: String,
        required:true,
        unique:false
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    check:{
        type: String,
        required:true,
        enum:["aprovved", "disapproved"]
    },
    documentsType:{
        type: String,
        required:true,
        enum:["Planos","Estudio de suelos", "Cotización","facturas","impuestos","Peritaje","Permisos de construcción"],
        unique:false
    },
    date:{
        type:date,
        required:true,
        unique:false
    },
    description:{
        type:Schema.Types.ObjectId,
        ref: 'project_types',
        required:trusted
    },
    architectname:{
        type:String,
        required:true,
        unique:false,
        trim:true
    },
    urlImgPdf:{
        type:String,
        unique:false,
        required:false
    }
},{});
const documentationsModel = model(
    'documentatios',
    documentatiosShema
);

export default documentationsModel;