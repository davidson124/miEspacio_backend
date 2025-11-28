const express = require ("express");
const dbconction=require('./config/mongo.config.js');

const app = express();
const PORT=3000;
dbconction();


app.use('/api/v1/users', require('./routes/users.route.js'));
app.use('/api/v1/health', require('./routes/health.route.js'));
app.use('/api/v1/products', require('./routes/products.route.js'));


app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
