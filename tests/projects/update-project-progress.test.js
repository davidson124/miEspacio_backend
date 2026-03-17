import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("PATCH /api/v1/projects/:id/progress", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseData = async () => {
    const client = await User.create({
      name: "Cliente",
      lastName: "Progress",
      email: "client-progress@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3030000001",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Progress",
      email: "architect-progress@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3030000002",
      role: "architect",
      isActive: true
    });

    const otherArchitect = await User.create({
      name: "Other",
      lastName: "Architect",
      email: "other-architect-progress@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3030000003",
      role: "architect",
      isActive: true
    });

    const admin = await User.create({
      name: "Admin",
      lastName: "Progress",
      email: "admin-progress@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3030000004",
      role: "admin",
      isActive: true
    });

    const service = await Service.create({
      title: "Servicio Progress",
      description: "Servicio para pruebas de progreso",
      features: ["Diseño", "Construcción"],
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
      estimatedBudget: 15000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });

    const project = await Project.create({
      title: "Proyecto progreso",
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 15000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 180,
      cover: {
        url: "https://example.com/project-progress.jpg",
        thumbUrl: "https://example.com/project-progress-thumb.jpg",
        publicId: "projects/covers/progress"
      },
      phases: [
        { name: "Diseño", progress: 10 },
        { name: "Planificación", progress: 0 }
      ],
      progressGeneral: 5
    });

    return { client, architect, otherArchitect, admin, project };
  };

  it("debe permitir que un admin actualice el progreso del proyecto", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const payload = {
      phases: [
        { name: "Diseño", progress: 50 },
        { name: "Planificación", progress: 20 }
      ],
      progressGeneral: 35
    };

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(200);

    const projectData = res.body.project ?? res.body.updatedProject ?? res.body;

    expect(projectData.progressGeneral).toBe(35);
    expect(Array.isArray(projectData.phases)).toBe(true);
    expect(projectData.phases[0].name).toBe("Diseño");
    expect(projectData.phases[0].progress).toBe(50);

    const updatedProject = await Project.findById(project._id);
    expect(updatedProject.progressGeneral).toBe(35);
    expect(updatedProject.phases[0].progress).toBe(50);
  });

  it("debe permitir que el architect asignado actualice el progreso del proyecto", async () => {
    const { architect, project } = await createBaseData();
    const token = buildToken(architect);

    const payload = {
      phases: [
        { name: "Diseño", progress: 60 },
        { name: "Planificación", progress: 30 }
      ],
      progressGeneral: 45
    };

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(200);

    const updatedProject = await Project.findById(project._id);
    expect(updatedProject.progressGeneral).toBe(45);
    expect(updatedProject.phases[0].progress).toBe(60);
  });

  it("debe responder 403 si un architect no asignado intenta actualizar el progreso", async () => {
    const { otherArchitect, project } = await createBaseData();
    const token = buildToken(otherArchitect);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: [{ name: "Diseño", progress: 50 }],
        progressGeneral: 50
      });

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 403 si un user normal intenta actualizar el progreso", async () => {
    const { client, project } = await createBaseData();
    const token = buildToken(client);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: [{ name: "Diseño", progress: 50 }],
        progressGeneral: 50
      });

    expect(res.statusCode).toBe(403);
  });

  it("debe responder 404 si el proyecto no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/v1/projects/${fakeId}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: [{ name: "Diseño", progress: 50 }],
        progressGeneral: 50
      });

    expect(res.statusCode).toBe(404);
  });

  it("debe responder 400 si no se envían phases ni progressGeneral", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("debe responder 400 si phases no es un arreglo", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: "esto no es un arreglo",
        progressGeneral: 20
      });

    expect(res.statusCode).toBe(400);
  });

  it("debe responder 400 si una fase no tiene name o progress", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: [{ progress: 20 }],
        progressGeneral: 20
      });

    expect(res.statusCode).toBe(400);
  });

  it("debe responder 400 si el progress de una fase está fuera del rango permitido", async () => {
    const { admin, project } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phases: [{ name: "Diseño", progress: 120 }],
        progressGeneral: 20
      });

    expect(res.statusCode).toBe(400);
  });

  it("debe responder 401 si no se envía token", async () => {
    const { project } = await createBaseData();

    const res = await request(app)
      .patch(`/api/v1/projects/${project._id}/progress`)
      .send({
        phases: [{ name: "Diseño", progress: 50 }],
        progressGeneral: 50
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });
});