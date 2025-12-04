import { ProductModel } from "../models/product.model.js"

const dbGetProducts= async ()=>{
    return await ProductModel.find(); 
};

const dbGetProductById= async (_id)=>{
    return await ProductModel.findOne({_id:idProduct})
}

const dbcreateProduct= async(data)=>{
    return await ProductModel.create(data)
}

const dbDeleteProduct = async (_id)=>{
    return await ProductModel.findByIdAndDelete(_id)
}

const dbUpdateProduct = async(_id, inputData)=>{
    return await ProductModel.findOneAndUpdate(
            //Objeto de consulta debe tener ID
            //Datos a actualizar
            //Confirguracion
            { _id},
            inputData,
            {new: true}
        )
}



export {dbGetProducts,
        dbGetProductById,
        dbcreateProduct,
        dbDeleteProduct,
        dbUpdateProduct
}