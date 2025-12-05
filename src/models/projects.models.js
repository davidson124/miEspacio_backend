import { Schema, model, now } from "mongoose"

const projectSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', "Completed"],
        default: "Pending"
    },
    description: {
        type: String,
    },
    progress: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        required: true,
        default: 0,
        min: 0

    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true
    }
},
    { timestamps: true })

const projectModel = model('projects', projectSchema)

export default projectModel