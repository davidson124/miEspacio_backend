import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("GET /api/v1/projects", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createService = async () => {
    return await Service.create({
      title: "Servicio All Projects",
      description: "Servicio para pruebas",
      features: ["Diseño", "Construcción"],
      isActive: true
    });
  };

  const createProject = async ({ title, client, architect, service }) => {
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
      estimatedBudget: 10000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });

    return await Project.create({
      title,
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 10000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 100,
      cover: {
        url: "https://example.com/project.jpg",
        thumbUrl: "https://example.com/project-thumb.jpg",
        publicId: `projects/covers/${title}`
      },
      phases: []
    });
  };

  it("debe permitir que un admin obtenga todos los proyectos", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Projects",
      email: "admin-all-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000001",
      role: "admin",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Projects",
      email: "architect-all-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000002",
      role: "architect",
      isActive: true
    });

    const client1 = await User.create({
      name: "Cliente1",
      lastName: "Projects",
      email: "client1-all-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000003",
      role: "user",
      isActive: true
    });

    const client2 = await User.create({
      name: "Cliente2",
      lastName: "Projects",
      email: "client2-all-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000004",
      role: "user",
      isActive: true
    });

    const service = await createService();

    await createProject({
      title: "Proyecto 1",
      client: client1,
      architect,
      service
    });

    await createProject({
      title: "Proyecto 2",
      client: client2,
      architect,
      service
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const projects = res.body.projects ?? res.body;

    expect(Array.isArray(projects)).toBe(true);
    expect(projects).toHaveLength(2);
  });

  it("debe devolver 200 y arreglo vacío si no existen proyectos", async () => {
    const admin = await User.create({
      name: "AdminEmpty",
      lastName: "Projects",
      email: "admin-empty-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000005",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const projects = res.body.projects ?? res.body;

    expect(Array.isArray(projects)).toBe(true);
    expect(projects).toHaveLength(0);
  });

  it("debe responder 403 si un user normal intenta acceder", async () => {
    const user = await User.create({
      name: "User",
      lastName: "Projects",
      email: "user-all-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000006",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un architect intenta acceder", async () => {
    const architect = await User.create({
      name: "ArchitectDenied",
      lastName: "Projects",
      email: "architect-denied-projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3040000007",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/projects");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});