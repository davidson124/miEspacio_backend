import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

describe("POST /api/v1/services (forbidden)", () => {
  it("no debe permitir que un usuario normal cree un servicio", async () => {
    const user = await User.create({
      name: "Cliente",
      lastName: "Normal",
      email: "user-create-service@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    const payload = {
      title: "Servicio ilegal",
      description: "Intento crear servicio",
      features: ["Feature 1"],
      order: 99
    };
    const res = await request(app)
      .post("/api/v1/services")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res.statusCode).toBe(403);
    const services = await Service.find();
    expect(services.length).toBe(0);
  });
});