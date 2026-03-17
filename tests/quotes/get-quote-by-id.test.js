import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("GET /api/v1/quotes/:id", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseData = async () => {
    const owner = await User.create({
      name: "Cliente",
      lastName: "Owner",
      email: "quote-owner@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3050000001",
      role: "user",
      isActive: true
    });

    const otherUser = await User.create({
      name: "Cliente",
      lastName: "Other",
      email: "quote-other@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3050000002",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Quote",
      email: "quote-architect@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3050000003",
      role: "architect",
      isActive: true
    });

    const admin = await User.create({
      name: "Admin",
      lastName: "Quote",
      email: "quote-admin@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3050000004",
      role: "admin",
      isActive: true
    });

    const service = await Service.create({
      title: "Servicio Quote By Id",
      description: "Servicio de prueba",
      features: ["Feature 1", "Feature 2"],
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
      estimatedBudget: 11000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "pendiente"
    });

    return { owner, otherUser, architect, admin, service, quote };
  };

  it("debe permitir que un admin obtenga una quote por id", async () => {
    const { admin, quote } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .get(`/api/v1/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const quoteData = res.body.quote ?? res.body;

    expect(quoteData._id.toString()).toBe(quote._id.toString());
    expect(quoteData.projectType).toBe("residencial");
  });

  it("debe permitir que el usuario dueño obtenga su quote", async () => {
    const { owner, quote } = await createBaseData();
    const token = buildToken(owner);

    const res = await request(app)
      .get(`/api/v1/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const quoteData = res.body.quote ?? res.body;
    const userId =
      typeof quoteData.user === "object"
        ? quoteData.user._id.toString()
        : quoteData.user.toString();

    expect(quoteData._id.toString()).toBe(quote._id.toString());
    expect(userId).toBe(owner._id.toString());
  });

  it("debe responder 403 si otro usuario intenta acceder a la quote", async () => {
    const { otherUser, quote } = await createBaseData();
    const token = buildToken(otherUser);

    const res = await request(app)
      .get(`/api/v1/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect no autorizado intenta acceder", async () => {
    const { architect, quote } = await createBaseData();
    const token = buildToken(architect);

    const res = await request(app)
      .get(`/api/v1/quotes/${quote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 404 si la quote no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/v1/quotes/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("debe responder 401 si no se envía token", async () => {
    const { quote } = await createBaseData();

    const res = await request(app).get(`/api/v1/quotes/${quote._id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});