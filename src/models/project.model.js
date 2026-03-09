import { Schema, model } from "mongoose"; 
import { DEFAULT_PROJECT_PHASES } from '../constants/projectPhases.js';

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    thumbUrl: { type: String },
    resourceType: { type: String, default: "auto" },
  },
  { _id: false }
);
const phaseSchema = new Schema(
  {
    name: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);
const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    architect: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, // 1 arquitecto

    relatedQuote: { type: Schema.Types.ObjectId, ref: "Quote", required: true, index: true },

    status: {
      type: String,
      enum: ["pendiente", "en_construccion", "pausado", "completado"],
      default: "pendiente",
      index: true,
    },

    budget: { type: Number, required: true, min: 0 },

    location: {
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },

    areaM2: { type: Number, min: 1 },

    startDate: { type: Date },
    estimatedEndDate: { type: Date },

    progressGeneral: { type: Number, default: 0, min: 0, max: 100 },
    phases: { type: [phaseSchema], default: DEFAULT_PROJECT_PHASES },

    cover: { type: mediaSchema, required: true },
    gallery: { type: [mediaSchema], default: [] },

    isDeleted: { type: Boolean, default: false, index: true },
  },{ timestamps: true }
);
export default model("Project", projectSchema);