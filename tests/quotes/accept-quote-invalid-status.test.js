import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/accept", () => {
  it("no debe permitir aceptar una cotización en estado pendiente", async () => {
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "cliente@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001234567",
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
      status: "pendiente"
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/accept`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no puede ser aceptada/i);
  });
});