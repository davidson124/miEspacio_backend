import { Schema, model } from "mongoose";

const projectDocumentSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["plano", "render", "estructura", "licencia", "factura", "otro"],
      default: "otro",
      index: true,
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isVisibleToClient: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default model("ProjectDocument", projectDocumentSchema);