import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/accept", () => {
  it("Debe permitir que el cliente acepte una cotización con propuesta generada", async () => {
    // Cliente
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "cliente@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001234567",
      role: "user",
      isActive: true
    });
    // Servicio
    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true
    });
    // Crear cotización directamente en DB con propuesta generada
    const quote = await Quote.create({
      user: user._id,
      clientSnapshot: {
        name: user.name,
        lastName: user.lastName,
        email: user.email
      },
      projectType: "residencial",
      service: service._id,
      serviceSnapshot: {
        title: service.title
      },
      estimatedBudget: 5000000,
      estimatedTime: "3-6 meses",
      location: "Bogotá",
      description: "Casa moderna",
      preferredContactMethod: "email",
      status: "propuesta_generada",
      proposalData: {
        items: [
          {
            description: "Diseño arquitectónico",
            quantity: 1,
            unitPrice: 2000000,
            total: 2000000
          }
        ],
        subtotal: 2000000,
        tax: 19,
        total: 2380000,
        validUntil: new Date(),
        notes: "Incluye una revisión"
      }
    });
    // Token del cliente
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/accept`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quote.status).toBe("aprobada");
    expect(res.body.quote.isAcceptedByClient).toBe(true);
    expect(res.body.quote.acceptedAt).toBeDefined();
  });
});