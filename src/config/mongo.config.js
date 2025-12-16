import mongoose from "mongoose";



export async function connect() {
    try{
        await mongoose.connect("mongodb://localhost:27017/quotes")
        console.log("connect db")
    }
    catch(err){
        console.log(err);
    }
}
