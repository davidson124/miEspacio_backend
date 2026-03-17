import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

describe("GET /api/v1/services/admin", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  it("debe permitir que un admin obtenga todos los servicios", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Services",
      email: "admin-services@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3080000001",
      role: "admin",
      isActive: true
    });

    await Service.create({
      title: "Servicio activo",
      description: "Servicio visible",
      features: ["Feature 1", "Feature 2"],
      isActive: true
    });

    await Service.create({
      title: "Servicio inactivo",
      description: "Servicio no visible al público",
      features: ["Feature A", "Feature B"],
      isActive: false
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/services/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const services = res.body.services ?? res.body;

    expect(Array.isArray(services)).toBe(true);
    expect(services).toHaveLength(2);
  });

  it("debe devolver 200 y arreglo vacío si no existen servicios", async () => {
    const admin = await User.create({
      name: "AdminEmpty",
      lastName: "Services",
      email: "admin-empty-services@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3080000002",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/services/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const services = res.body.services ?? res.body;

    expect(Array.isArray(services)).toBe(true);
    expect(services).toHaveLength(0);
  });

  it("debe responder 403 si un user normal intenta acceder", async () => {
    const user = await User.create({
      name: "User",
      lastName: "Services",
      email: "user-services@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3080000003",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/services/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect intenta acceder", async () => {
    const architect = await User.create({
      name: "Architect",
      lastName: "Services",
      email: "architect-services@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3080000004",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/services/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/services/admin");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});