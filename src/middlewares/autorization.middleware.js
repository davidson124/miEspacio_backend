const authorizactionUser=(req,res,next)=>{
    console.log('hola soy el middleware de autorización ');

    next();
}

export default authorizactionUser;