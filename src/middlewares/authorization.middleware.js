const authorizationUser = (req,res,next) => {
    // console.log(`Hola soy el Middleware de Autorizacion`);

    const token = req.header( 'X-Token' )

    next();
}

export default authorizationUser