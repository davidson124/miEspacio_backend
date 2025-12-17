import { Schema, model } from "mongoose";

const billingSchema = new Schema ({
    NumberBill: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required:true,
        trim:true        
    },
    typeProyect: {
        type:String,
        required: true,
        trim: true
    },
    concept:{
        type:String,
        required:true,
        trim: true
    },
    BillValue:{
        type:Number,
        required:true,
        trim:true
    },
    BillExpiration:{
        type: Date,
        required:true,
        trim: true
    },
    isPaid:{
        type: Boolean,
        default: false
    },
    isnotPaid:{
        type: Boolean,
        default: true
    },
    urlBillImg:{
        type:String,
        required:true,  
    }
},{});

const billingModel = model(
    'billing',
     billingSchema
)
export default billingModel;