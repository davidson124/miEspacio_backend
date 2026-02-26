import { Schema, model } from "mongoose";
import Counter from "./counter.model.js";

const quoteSchema = new Schema({
  quoteNumber: {
    type: Number,
    unique: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clientSnapshot: {
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true}
  },
  projectType: {
    type: String,
    required: true
  },
  specificService: {
    type: String,
    required: true
  },
  estimatedBudget: {
    type: Number,
    required: true
  },

  estimatedTime: {
    type: String,
    enum: ["1-3 meses", "3-6 meses", "6-12 meses", "flexible"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  preferredContactMethod: {
    type: String,
    enum: ["email", "telefono"]
  },
  status: {
    type: String,
    enum: ["propuesta_generada","pendiente", "en revision", "aprobada", "rechazada","archivada"],
    default: "pendiente"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  proposalData:{
    items:[
      {
        description: { type: String, required: true},
        quantity: { type: Number, required: true},
        unitPrice: { type: Number, required: true},
        total:{ type: Number, required: true}
      }
    ],
    subtotal: { type: Number, required: true},
    tax: { type: Number, default: 12 },//Porcentaje de impuesto, por ejemplo 12% IVA
    total: { type: Number, required: true},
    validUntil: { type: Date },
    motes: { type: String }
  },
}, { timestamps: true });
quoteSchema.pre("save", async function () {
  if (!this.isNew) return;
  const counter = await Counter.findOneAndUpdate(
    { name: "quote" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  this.quoteNumber = counter.seq;
});
quoteSchema.virtual("quoteCode").get(function () {
  if (!this.quoteNumber && this.quoteNumber !== 0) return null;
  //Retornar prefijo COT- de la factura y 5 ceros a la izquierda del número de factura
  return `COT-${String(this.quoteNumber).padStart(5, "0")}`;
});
//Mostrar el campo virtual quoteCode al convertir a JSON o a objeto
quoteSchema.set("toJSON", { virtuals: true });
quoteSchema.set("toObject", { virtuals: true });
export default model("Quote", quoteSchema);
