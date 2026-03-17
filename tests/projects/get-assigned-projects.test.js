import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("GET /api/v1/projects/assigned", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createService = async () => {
    return await Service.create({
      title: "Servicio Assigned",
      description: "Servicio para pruebas de proyectos asignados",
      features: ["Planos", "Diseño"],
      isActive: true
    });
  };

  const createQuote = async ({ clientId, serviceId, suffix }) => {
    return await Quote.create({
      user: clientId,
      clientSnapshot: {
        name: `Cliente${suffix}`,
        lastName: "Assigned",
        email: `cliente-assigned-${suffix}@test.com`
      },
      projectType: "residencial",
      service: serviceId,
      serviceSnapshot: {
        title: "Servicio Assigned"
      },
      estimatedBudget: 12000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });
  };

  it("debe permitir que un architect obtenga solo sus proyectos asignados", async () => {
    const architect = await User.create({
      name: "Architect",
      lastName: "Assigned",
      email: "architect-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000001",
      role: "architect",
      isActive: true
    });

    const otherArchitect = await User.create({
      name: "Other",
      lastName: "Architect",
      email: "other-architect-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000002",
      role: "architect",
      isActive: true
    });

    const client1 = await User.create({
      name: "Cliente1",
      lastName: "Assigned",
      email: "client1-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000003",
      role: "user",
      isActive: true
    });

    const client2 = await User.create({
      name: "Cliente2",
      lastName: "Assigned",
      email: "client2-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000004",
      role: "user",
      isActive: true
    });

    const service = await createService();

    const quote1 = await createQuote({
      clientId: client1._id,
      serviceId: service._id,
      suffix: "1"
    });

    const quote2 = await createQuote({
      clientId: client2._id,
      serviceId: service._id,
      suffix: "2"
    });

    const myProject = await Project.create({
      title: "Proyecto mío",
      client: client1._id,
      architect: architect._id,
      relatedQuote: quote1._id,
      budget: 12000000,
      location: { city: "Bogotá", country: "Colombia" },
      areaM2: 130,
      cover: {
        url: "https://example.com/project1.jpg",
        thumbUrl: "https://example.com/project1-thumb.jpg",
        publicId: "projects/covers/project1"
      },
      phases: []
    });

    await Project.create({
      title: "Proyecto ajeno",
      client: client2._id,
      architect: otherArchitect._id,
      relatedQuote: quote2._id,
      budget: 15000000,
      location: { city: "Medellín", country: "Colombia" },
      areaM2: 140,
      cover: {
        url: "https://example.com/project2.jpg",
        thumbUrl: "https://example.com/project2-thumb.jpg",
        publicId: "projects/covers/project2"
      },
      phases: []
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/projects/assigned")
      .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.projects)).toBe(true);
  expect(res.body.projects).toHaveLength(1);
  expect(res.body.projects[0]._id.toString()).toBe(myProject._id.toString());
  expect(res.body.projects[0].title).toBe("Proyecto mío");
  });

  it("debe devolver 200 y arreglo vacío si el architect no tiene proyectos asignados", async () => {
    const architect = await User.create({
      name: "ArchitectEmpty",
      lastName: "Assigned",
      email: "architect-empty-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000005",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/projects/assigned")
      .set("Authorization", `Bearer ${token}`);

   expect(Array.isArray(res.body.projects)).toBe(true);
   expect(res.body.projects).toHaveLength(0);
  });

  it("debe responder 403 si un user normal intenta acceder", async () => {
    const user = await User.create({
      name: "User",
      lastName: "Assigned",
      email: "user-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000006",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/projects/assigned")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("No autorizado.");
  });

  it("debe responder 403 si un admin intenta acceder", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Assigned",
      email: "admin-assigned@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3010000007",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/projects/assigned")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("No autorizado.");
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/projects/assigned");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});