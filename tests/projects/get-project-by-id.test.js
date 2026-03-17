import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

// Helpers
const extractId = (value) =>
  typeof value === "object" ? value._id.toString() : value.toString();

describe("GET /api/v1/projects/:id", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseData = async () => {
    const client = await User.create({
      name: "Cliente",
      lastName: "Owner",
      email: "client-owner-project@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3020000001",
      role: "user",
      isActive: true
    });

    const otherClient = await User.create({
      name: "Cliente",
      lastName: "Other",
      email: "client-other-project@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3020000002",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Assigned",
      email: "architect-owner-project@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3020000003",
      role: "architect",
      isActive: true
    });

    const otherArchitect = await User.create({
      name: "Architect",
      lastName: "Other",
      email: "architect-other-project@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3020000004",
      role: "architect",
      isActive: true
    });

    const admin = await User.create({
      name: "Admin",
      lastName: "Project",
      email: "admin-project-by-id@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3020000005",
      role: "admin",
      isActive: true
    });

    const service = await Service.create({
      title: "Servicio Project By Id",
      description: "Servicio de prueba",
      features: ["Diseño", "Planos"],
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
      estimatedBudget: 13000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });

    const project = await Project.create({
      title: "Proyecto detalle",
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 13000000,
      location: { city: "Bogotá", country: "Colombia" },
      areaM2: 150,
      cover: {
        url: "https://example.com/project-detail.jpg",
        thumbUrl: "https://example.com/project-detail-thumb.jpg",
        publicId: "projects/covers/project-detail"
      },
      phases: []
    });

    return {
      client,
      otherClient,
      architect,
      otherArchitect,
      admin,
      project
    };
  };

  it("debe permitir que un admin obtenga un proyecto por id", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .get(`/api/v1/projects/${project._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const projectData = res.body.project ?? res.body;

    expect(projectData._id.toString()).toBe(project._id.toString());
    expect(projectData.title).toBe("Proyecto detalle");
  });

 it("debe permitir que el cliente dueño obtenga su proyecto", async () => {
  const { client, project } = await createBaseData();
  const token = buildToken(client);

  const res = await request(app)
    .get(`/api/v1/projects/${project._id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);

  const projectData = res.body.project ?? res.body;

  expect(projectData._id.toString()).toBe(project._id.toString());
  expect(extractId(projectData.client)).toBe(client._id.toString());
});

  it("debe permitir que el architect asignado obtenga su proyecto", async () => {
    const { architect, project } = await createBaseData();
    const token = buildToken(architect);

    const res = await request(app)
      .get(`/api/v1/projects/${project._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const projectData = res.body.project ?? res.body;

    expect(projectData._id.toString()).toBe(project._id.toString());
  });

  it("debe responder 403 si un user no relacionado intenta acceder", async () => {
    const { otherClient, project } = await createBaseData();
    const token = buildToken(otherClient);

    const res = await request(app)
      .get(`/api/v1/projects/${project._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect no asignado intenta acceder", async () => {
    const { otherArchitect, project } = await createBaseData();
    const token = buildToken(otherArchitect);

    const res = await request(app)
      .get(`/api/v1/projects/${project._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 404 si el proyecto no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/v1/projects/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("debe responder 401 si no se envía token", async () => {
    const { project } = await createBaseData();

    const res = await request(app).get(`/api/v1/projects/${project._id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});