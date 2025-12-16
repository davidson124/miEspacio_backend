const createDocumentations = async (req, res)=>{
    try{
        const imputData =req.body;
        const documentationsRegistered = await dbDocumentationsRegistered(imputData);
        res.jason({msg:'Documentación creada correctamente. ',documentationsRegistered});
    }catch(error){
        console.error(error);
        res.jason({msg:'Error: no se puede generar la documentación'})
    }
}