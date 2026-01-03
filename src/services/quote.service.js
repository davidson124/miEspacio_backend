import quotesModel from "../models/quotes.model.js";

const dbGetAllQuotes = async () =>{
    return await quotesModel.find();
}

const dbCreateQuotes = async (newquotes) => {
    return await quotesModel.create(newquotes);
        
}

const dbpatchQuotes = async (newquotes, _id) =>{
    return await quotesModel.findByIdAndUpdate(_id, newquotes, {new:true})
}
const dbdeleteQuotes = async (_id) =>{
    return await quotesModel.findOneAndDelete({_id})
}


export{
    dbGetAllQuotes,
    dbCreateQuotes,
    dbpatchQuotes,
    dbdeleteQuotes,
    

}