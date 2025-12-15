import { dbCreateQuote, dbDeleteQuote, dbGetAllQuotes, dbGetQuoteById, dbUpdateQuote } from "../services/quotation.service"


const getAllQuotes = async (req,res)=>{
    try {
        const quotes= await dbGetAllQuotes()
    
        res.json({
            message: `Quotes successfully brought`,
            quotes
        })
        
    } catch (error) {
        console.error(error)
        res.json({
            message:`Could not find quotations, please try again`
        })
    }

}

const getQuoteById = async (req,res)=>{
    try {
        const data= req.params.quoteId
    
        const quote = await dbGetQuoteById(data)
    
        res.json({
            message: `Quote successfully brought`,
            quote
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message:`Could not find quote, please try again`
        })
        
    }
}

const createQuote = async (req,res)=>{
    try {
        const inputData= req.body;
    
        const quote= await dbCreateQuote(inputData)
    
        res.json({
            message: `Quote created`,
            quote
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Quote could not be created, please try again`
        })
    }
}

const updateQuote = async (req,res)=>{
    try {
        const data= req.params.quoteId;
        const inputData= req.body;
    
        const quote= await dbUpdateQuote(inputData, data)
    
        res.json({
            message:`Quote successfully updated`,
            quote
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Quote could not be updated, please try again`
        })
        
    }

}

const deleteQuote = async (req,res)=>{
    try {
        const data=req.params.quoteId
    
        const quote= await dbDeleteQuote(data)
    
        res.json({
            message: `Quote successfully erased`,
            quote
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message:`Quote could not be erased, please try again`,
        })
        
    }

}

export{
    getAllQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote
}