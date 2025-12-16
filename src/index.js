import express from "express";


import projectTypesRoute from "./routes/project-types.route.js";
import { connect } from "./config/mongo.config.js";


const app = express();

connect();

app.use(express.json())

app.use("/api/v1/project-types", projectTypesRoute)



app.listen(3000, ()=>
console.log("serve running")
)



