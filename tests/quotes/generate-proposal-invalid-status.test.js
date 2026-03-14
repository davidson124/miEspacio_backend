import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
describe("PATCH /api/v1/quotes/:id/proposal", () => {
  it("no debe permitir generar propuesta si la cotización ya está en propuesta_generada", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-invalid-proposal@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });
    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-invalid-proposal@test.com",
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
        notes: "Ya existe propuesta"
      }
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
        notes: "Nueva propuesta",
        items: [
          {
            description: "Nuevo item",
            quantity: 1,
            unitPrice: 3000000
          }
        ]
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/ya fue generada|no puede modificarse/i);
  });
});