import { Schema, model } from "mongoose";

const quotesSchema = new Schema({
  //presupuesti estimado
  estimatedBudget: {
    type: Number,
    required: true,
  },
  //Tiempo estimado
  estimatedTime: {
    type: String,
    enum: ["1-3 meses", "3-6 meses", "6-12 meses", "flexible"],
    required: true,
  },
  //id_proyecto
  project_id: {
    type: Schema.Types.ObjectId,
    ref: "projects",
    required: false,
  },
  //tipo de proyecto
  project_type: {
    type: Schema.Types.ObjectId,
    ref: "project_types",
    required: false,
  },
});

const quotesModel = model("quotes", quotesSchema);

export default quotesModel;
