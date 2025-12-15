const withoutRole = ( req, res, next ) => {
    delete req.body.role;
    next();
};


export default withoutRole;