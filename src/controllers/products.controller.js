
import { dbcreateProduct, dbDeleteProduct, dbGetProductById, dbGetProducts, dbUpdateProduct } from "../services/product.service.js"



const getProducts = async (req, res) => {
    try {
        const data = await dbGetProducts();

        res.json(
            {
                message: `Products successfully brought`,
                ok: true,
                data
            })

    } catch (error) {
        console.error(error);
        res.json({
            msg: "Error: Unable to bring user´s list"
        })

    }


}

const getProductById = async (req, res) => {
    try {
        const idProduct = req.params.idProduct;

        const product = await dbGetProductById(idProduct)

        res.json({
            message: `Product found`,
            id: product
        })

    } catch (error) {
        console.error(error)
        res.json({
            message: `Error: Product not found by ID`
        })

    }

}

const createProduct = async (req, res) => {
    try {
        const data = req.body;

        const product = await dbcreateProduct(data)

        res.json({
            message: `Product successfully created`,
            product
        })

    } catch (error) {
        console.error(error);
        res.json({
            message: `Error: Product was not created`
        })

    }

}

const deleteProductById = async (req, res) => {
    try {
        const idProduct = req.params.idProduct;

        const productDeleted = await dbDeleteProduct(idProduct)

        res.json({
            message: `Product has been successfully deleted`,
            productDeleted
        })

    } catch (error) {
        console.error(error),
            res.json({
                message: `Error: Product couldn´t be deleted`
            })
    }


}

const updateProduct = async (req, res) => {
    try {

        const inputData = req.body;
        const productId = req.params.idProduct;

        const productUpdated = await dbUpdateProduct(productId, inputData)

        res.json({
            message: `Product successfully updated`,
            productUpdated
        })

    } catch (error) {
        console.error(error)
        res.json({
            message: `Product was not successfully changed`
        })

    }

}

export {
    getProducts,
    createProduct,
    getProductById,
    deleteProductById,
    updateProduct
}