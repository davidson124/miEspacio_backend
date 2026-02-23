const erroHandler = (err, req, res, next)=>{
    console.error('Error capturado',err);
    //Error Id.
    if(err.name === "CastError"){ return res.status(400).json({message: "Id no valido"}); }
    //Error duplicado
    if(err.code === 11000){ return res.status(400).json({message: "El recurso ya existe"});}
    //Error de validacion
    if(err.name === "ValidationError"){ return res.status(400).json({message: Object.values(err.errors).map(e => e.message).join(", ")}); }
    //Error personalizado
    if(err.isOperational){ return res.status(err.statusCode).json({message: err.message}); }
    //Error inesperado
    return  res.status(500).json({message: "Error interno del servidor"});
};
export default erroHandler;