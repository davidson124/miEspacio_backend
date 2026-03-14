import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/accept", () => {
  it("debe impedir que un usuario acepte la cotización de otro usuario", async () => {
    // Dueño real de la cotización
    const owner = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "owner@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001234567",
      role: "user",
      isActive: true
    });

    // Usuario ajeno
    const stranger = await User.create({
      name: "Juan",
      lastName: "Pérez",
      email: "stranger@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3007654321",
      role: "user",
      isActive: true
    });

    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true
    });

    const quote = await Quote.create({
      user: owner._id,
      clientSnapshot: {
        name: owner.name,
        lastName: owner.lastName,
        email: owner.email
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

    const token = jwt.sign(
      { id: stranger._id.toString(), role: stranger.role },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/accept`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/No autorizado/i);
  });
});