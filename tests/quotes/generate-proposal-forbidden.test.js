import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/proposal", () => {
  it("debe impedir que un usuario normal genere una propuesta", async () => {
    const normalUser = await User.create({
      name: "Usuario",
      lastName: "Normal",
      email: "user-no-proposal@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
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
      user: normalUser._id,
      clientSnapshot: {
        name: normalUser.name,
        lastName: normalUser.lastName,
        email: normalUser.email
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
    const userToken = jwt.sign(
      { id: normalUser._id.toString(), role: normalUser.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/proposal`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        tax: 19,
        validUntil: "2026-12-31",
        notes: "Intento inválido",
        items: [
          {
            description: "Diseño arquitectónico",
            quantity: 1,
            unitPrice: 2000000
          }
        ]
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/acceso denegado|no autorizado/i);
  });
});
