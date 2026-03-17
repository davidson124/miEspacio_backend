import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("GET /api/v1/quotes", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createService = async () => {
    return await Service.create({
      title: "Servicio All Quotes",
      description: "Servicio para pruebas de listado",
      features: ["Feature 1", "Feature 2"],
      isActive: true
    });
  };

  const createQuote = async ({ owner, service, suffix }) => {
    return await Quote.create({
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
      estimatedBudget: 10000000 + suffix * 1000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "pendiente"
    });
  };

  it("debe permitir que un admin obtenga todas las quotes", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Quotes",
      email: "admin-all-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000001",
      role: "admin",
      isActive: true
    });

    const user1 = await User.create({
      name: "Cliente1",
      lastName: "Quotes",
      email: "user1-all-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000002",
      role: "user",
      isActive: true
    });

    const user2 = await User.create({
      name: "Cliente2",
      lastName: "Quotes",
      email: "user2-all-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000003",
      role: "user",
      isActive: true
    });

    const service = await createService();

    await createQuote({ owner: user1, service, suffix: 1 });
    await createQuote({ owner: user2, service, suffix: 2 });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/quotes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const quotes = res.body.quotes ?? res.body;

    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes).toHaveLength(2);
  });

  it("debe devolver 200 y arreglo vacío si no existen quotes", async () => {
    const admin = await User.create({
      name: "AdminEmpty",
      lastName: "Quotes",
      email: "admin-empty-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000004",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/quotes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const quotes = res.body.quotes ?? res.body;

    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes).toHaveLength(0);
  });

  it("debe responder 403 si un user normal intenta acceder", async () => {
    const user = await User.create({
      name: "User",
      lastName: "Quotes",
      email: "user-all-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000005",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/quotes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect intenta acceder", async () => {
    const architect = await User.create({
      name: "Architect",
      lastName: "Quotes",
      email: "architect-all-quotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3070000006",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/quotes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/quotes");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});