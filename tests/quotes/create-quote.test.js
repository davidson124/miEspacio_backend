import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

describe("POST /api/v1/quotes", () => {
  it("debe crear una cotización con serviceId válido", async () => {
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "test@test.com",
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

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/v1/quotes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectType: "residencial",
        serviceId: service._id.toString(),
        estimatedBudget: 5000000,
        estimatedTime: "3-6 meses",
        location: "Bogotá",
        description: "Casa moderna",
        preferredContactMethod: "email"
      });

    console.log("STATUS:", res.statusCode);
    console.log("BODY:", res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.quote.projectType).toBe("residencial");
    expect(res.body.quote.serviceSnapshot.title).toBe("Diseño Residencial");
  });
});