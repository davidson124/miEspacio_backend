import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";
import ProjectDocument from "../../src/models/projectDocument.model.js";

describe("POST /api/v1/projects-documents", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseProject = async () => {
    const client = await User.create({
      name: "Cliente",
      lastName: "Prueba",
      email: "cliente-doc-create@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000001",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Arquitecto",
      lastName: "Asignado",
      email: "architect-create@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000002",
      role: "architect",
      isActive: true
    });

    const service = await Service.create({
      title: "Diseño Arquitectónico",
      description: "Servicio activo",
      features: ["Planos", "Render"],
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
      estimatedBudget: 8000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });

    const project = await Project.create({
      title: "Proyecto Documento Test",
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 8000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 120,
      cover: {
        url: "https://example.com/project-cover.jpg",
        thumbUrl: "https://example.com/project-cover-thumb.jpg",
        publicId: "projects/covers/doc-test"
      },
      phases: []
    });

    return { client, architect, service, quote, project };
  };

  it("debe permitir que un admin cree un documento correctamente", async () => {
    const { project } = await createBaseProject();

    const admin = await User.create({
      name: "Admin",
      lastName: "Sistema",
      email: "admin-doc-create@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000003",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const payload = {
      projectId: project._id.toString(),
      title: "Plano estructural",
      category: "plano",
      fileUrl: "https://example.com/plano-estructural.pdf",
      publicId: "projects/documents/plano-estructural",
      isVisibleToClient: true
    };

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Documento guardado correctamente.");
    expect(res.body.document.title).toBe(payload.title);
    expect(res.body.document.project.toString()).toBe(project._id.toString());
    expect(res.body.document.uploadedBy.toString()).toBe(admin._id.toString());
    expect(res.body.document.isVisibleToClient).toBe(true);

    const savedDoc = await ProjectDocument.findById(res.body.document._id);
    expect(savedDoc).not.toBeNull();
    expect(savedDoc.title).toBe(payload.title);
  });

  it("debe permitir que el arquitecto asignado cree un documento correctamente", async () => {
    const { project, architect } = await createBaseProject();

    const token = buildToken(architect);

    const payload = {
      projectId: project._id.toString(),
      title: "Render fachada",
      category: "render",
      fileUrl: "https://example.com/render-fachada.pdf",
      publicId: "projects/documents/render-fachada",
      isVisibleToClient: false
    };

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Documento guardado correctamente.");
    expect(res.body.document.title).toBe(payload.title);
    expect(res.body.document.uploadedBy.toString()).toBe(architect._id.toString());
    expect(res.body.document.isVisibleToClient).toBe(false);
  });

  it("debe responder 403 si un user normal intenta crear un documento", async () => {
    const { project } = await createBaseProject();

    const user = await User.create({
      name: "Usuario",
      lastName: "Normal",
      email: "user-doc-create@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000004",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectId: project._id.toString(),
        title: "Documento prohibido",
        category: "plano",
        fileUrl: "https://example.com/doc.pdf"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Acceso denegado.");
  });

  it("debe responder 400 si faltan datos obligatorios", async () => {
    const { project } = await createBaseProject();

    const admin = await User.create({
      name: "Admin2",
      lastName: "Sistema",
      email: "admin-doc-create-2@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000005",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectId: project._id.toString(),
        category: "plano"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Faltan datos obligatorios.");
  });

  it("debe responder 404 si el proyecto no existe", async () => {
    const admin = await User.create({
      name: "Admin3",
      lastName: "Sistema",
      email: "admin-doc-create-3@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000006",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const fakeProjectId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectId: fakeProjectId.toString(),
        title: "Documento inexistente",
        category: "plano",
        fileUrl: "https://example.com/no-project.pdf"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Proyecto no encontrado.");
  });

  it("debe responder 403 si un architect no está asignado al proyecto", async () => {
    const { project } = await createBaseProject();

    const otherArchitect = await User.create({
      name: "Otro",
      lastName: "Arquitecto",
      email: "other-architect-doc-create@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001000007",
      role: "architect",
      isActive: true
    });

    const token = buildToken(otherArchitect);

    const res = await request(app)
      .post("/api/v1/projects-documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        projectId: project._id.toString(),
        title: "Documento no autorizado",
        category: "plano",
        fileUrl: "https://example.com/no-auth.pdf"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("No autorizado.");
  });
});