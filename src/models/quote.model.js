import { Schema, model } from "mongoose";
import Counter from "./counter.model.js";

//Items de la propuesta formal que genera admin después.
const proposalItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);
const quoteSchema = new Schema(
  {
    //Consecutivo interno
    quoteNumber: {
      type: Number,
      unique: true,
      index: true
    },
    //Usuario crea cotización
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    //Snapshot del cliente al momento de cotizar
    clientSnapshot: {
      name: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true }
    },
    //Tipo general del proyecto
    projectType: {
      type: String,
      required: true,
      trim: true
    },
    //Referencia al servicio real
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    //Snapshot del nombre del servicio al momento de crear la cotización
    serviceSnapshot: {
      title: {
        type: String,
        required: true,
        trim: true
      }
    },
    //Compatibilidad opcional si alguna prueba vieja aún lo manda
    specificService: {
      type: String,
      trim: true
    },
    //Datos básicos de la solicitud
    estimatedBudget: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedTime: {
      type: String,
      enum: ["1-3 meses", "3-6 meses", "6-12 meses", "flexible"],
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "telefono"]
    },
    //Propuesta formal generada por admin
    proposalData: {
      items: {
        type: [proposalItemSchema],
        default: []
      },
      subtotal: { type: Number, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      total: { type: Number, min: 0 },
      validUntil: { type: Date },
      notes: { type: String, trim: true }
    },
    //Flujo de negocio
    status: {
      type: String,
      enum: [
        "pendiente",
        "en_revision",
        "propuesta_generada",
        "aprobada",
        "contratada",
        "rechazada",
        "archivada"
      ],
      default: "pendiente"
    },
    //Aceptación del cliente
    isAcceptedByClient: {
      type: Boolean,
      default: false
    },
    acceptedAt: {
      type: Date
    },
    //Si la cotización genera un proyecto
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
//Virtual para mostrar código 
quoteSchema.virtual("quoteCode").get(function () {
  if (this.quoteNumber === undefined || this.quoteNumber === null) return null;
  return `COT-${String(this.quoteNumber).padStart(5, "0")}`;
});
quoteSchema.set("toJSON", { virtuals: true });
quoteSchema.set("toObject", { virtuals: true });
//Generar consecutivo automático
quoteSchema.pre("save", async function () {
  if (!this.isNew) return;
  const counter = await Counter.findOneAndUpdate(
    { name: "quote" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  this.quoteNumber = counter.seq;
});
export default model("Quote", quoteSchema);