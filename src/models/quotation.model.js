import { Schema, model } from "mongoose";

const quotationSchema= new Schema({
    estimatedBudget:{
        type: Number,
        required: true,
        default: 0,
        min: 0},
    estimatedTime:{
        type:String,
        enum:["Urgente(Menos de 1 mes)", "1-3 meses", "3-6 meses", "6-12 meses", "Flexible"],
        default: "Flexible",
        required: true
    },
    projectAddress:{
        type: String,
        required: true
    },
    projectDescription:{
        type: String,
        required: true
    },
    attachedDocs:{
        required: false
    }
})


const quotationModel = model("quotation", quotationSchema)


export default quotationModel