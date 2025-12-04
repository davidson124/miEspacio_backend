import {Schema, model} from "mongoose";

const ProductSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    quantity:{
        type: Number,
        required: true,
        default: 0
    }

},
{timestamps: true});

const ProductModel = model(
    "Products",             //APODO DE LA COLECCION
    ProductSchema, );        //ESTRUCTURA DE LA COLECCION



export {ProductModel}