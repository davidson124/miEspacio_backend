import {Schema, model} from 'mongoose';

const imageSchema = new Schema ({
    url: {type:String, required:true, trim:true},
    thumbUrl: { type: String, required:true },
    publicId: { type:String }
},{ _id: false });

const workSchema = new Schema ({
    title:{ type:String, required:true, trim:true },
    category:{
        type:String,
        required:true,
        enum:["residencial","comercial","remodelacion","interiores"],
        index:true
    },
    location:{
        city:{type:String, required:true},
        country:{type:String, required:true}
    },
    year:{ type:Number, required: true, min: 1900, max: 2100 },
    areaM2:{ type:Number, required: true, min: 1},
    cover:{ type: imageSchema, required:true},
    features:[
        { type:String, trim:true }
    ],
    isPublished:{type:Boolean, default:true, index:true},
    isDeleted:{type:Boolean, default:false, index:true}
    
},{timestamps:true});
export default model("Work", workSchema);