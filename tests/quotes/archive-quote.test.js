import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("PATCH /api/v1/quotes/:id/archive", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseData = async () => {
    const owner = await User.create({
      name: "Cliente",
      lastName: "Archive",
      email: "quote-archive-owner@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3060000001",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Archive",
      email: "quote-archive-architect@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3060000002",
      role: "architect",
      isActive: true
    });

    const admin = await User.create({
      name: "Admin",
      lastName: "Archive",
      email: "quote-archive-admin@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3060000003",
      role: "admin",
      isActive: true
    });

    const service = await Service.create({
      title: "Servicio Archive Quote",
      description: "Servicio para pruebas de archivado",
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
      estimatedBudget: 12500000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "pendiente",
      isArchived: false
    });

    return { owner, architect, admin, quote };
  };

  it("debe permitir que un admin archive una quote correctamente", async () => {
  const { admin, quote } = await createBaseData();
  const token = buildToken(admin);

  const res = await request(app)
    .patch(`/api/v1/quotes/${quote._id}/archive`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);

  const updatedQuote = await Quote.findById(quote._id);
  expect(updatedQuote).not.toBeNull();

  // reemplaza por el campo real después de inspeccionar
  expect(updatedQuote.status).toBe("archivada");
});

  it("debe responder 403 si un user normal intenta archivar una quote", async () => {
    const { owner, quote } = await createBaseData();
    const token = buildToken(owner);

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/archive`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect intenta archivar una quote", async () => {
    const { architect, quote } = await createBaseData();
    const token = buildToken(architect);

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/archive`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 404 si la quote no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/v1/quotes/${fakeId}/archive`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("debe responder 401 si no se envía token", async () => {
    const { quote } = await createBaseData();

    const res = await request(app)
      .patch(`/api/v1/quotes/${quote._id}/archive`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});