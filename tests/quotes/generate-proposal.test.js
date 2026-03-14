import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/proposal", () => {
  it("debe permitir que el admin genere una propuesta y calcular los totales", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-proposal@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });

    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-proposal@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
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
      user: client._id,
      clientSnapshot: {
        name: client.name,
        lastName: client.lastName,
        email: client.email
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
      status: "pendiente"
    });

    const adminToken = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/proposal`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        tax: 19,
        validUntil: "2026-12-31",
        notes: "Incluye dos revisiones.",
        items: [
          {
            description: "Diseño arquitectónico",
            quantity: 1,
            unitPrice: 2000000
          },
          {
            description: "Supervisión técnica",
            quantity: 2,
            unitPrice: 500000
          }
        ]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.quote.status).toBe("propuesta_generada");

    expect(res.body.quote.proposalData.items).toHaveLength(2);

    // subtotal = 2,000,000 + (2 * 500,000) = 3,000,000
    expect(res.body.quote.proposalData.subtotal).toBe(3000000);
    expect(res.body.quote.proposalData.tax).toBe(19);

    // total = 3,000,000 + 19%
    expect(res.body.quote.proposalData.total).toBe(3570000);

    expect(res.body.quote.proposalData.notes).toBe("Incluye dos revisiones.");
    expect(res.body.quote.proposalData.validUntil).toBeDefined();
  });
});
