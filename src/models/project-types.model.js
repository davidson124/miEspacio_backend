import { Schema,model } from "mongoose";

const projectTypeSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})
const projectTypeModel = model ("project_types",projectTypeSchema)

export default projectTypeModel;