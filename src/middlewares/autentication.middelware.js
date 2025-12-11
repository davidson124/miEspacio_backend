import { verifyToken } from "../helpers/jwt.heper.js";

const authUser = (req, res, next )=>{
    try{
        //Paso:1 Obtener string donde viene el token
            const token = req.header('authorization');
            

            //Paso:2 verificar que la cadena este vacia

            if(!token){
                return res.json({msg:'Error: cadena del string vacia '})
            }
            //Paso:3 verificar si el token es valido
            const payload = verifyToken(token);

            //console.log('middleware autenticación',payload);

            //Paso4: enviar a través del request los datos del payLoad
            req.payload = payload;

            //paso5: Saltar a la siguiente función definida en la ruta
            next();
    }catch(error){
        console.error(error);
        res.json({msg:'Error: token invalido'});
    }
    
    
}


export default authUser;