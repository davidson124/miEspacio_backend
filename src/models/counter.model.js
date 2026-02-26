import { Schema, model } from "mongoose";
const counterSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    seq:{
        type: Number,
        default: 0
    },
},{ timestamps: true });
export default model('Counter', counterSchema);