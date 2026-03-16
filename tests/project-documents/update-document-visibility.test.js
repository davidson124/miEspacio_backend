import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";
import ProjectDocument from "../../src/models/projectDocument.model.js";

describe("PATCH /api/v1/projects-documents/:id/visibility", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  const createBaseData = async () => {
    const client = await User.create({
      name: "Cliente",
      lastName: "Visibility",
      email: "client-visibility@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002000001",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Architect",
      lastName: "Visibility",
      email: "architect-visibility@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002000002",
      role: "architect",
      isActive: true
    });

    const admin = await User.create({
      name: "Admin",
      lastName: "Visibility",
      email: "admin-visibility@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002000003",
      role: "admin",
      isActive: true
    });

    const service = await Service.create({
      title: "Servicio Visibility",
      description: "Servicio para pruebas",
      features: ["Feature 1", "Feature 2"],
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
      estimatedBudget: 9000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });

    const project = await Project.create({
      title: "Proyecto Visibility",
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 9000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 95,
      cover: {
        url: "https://example.com/project-cover.jpg",
        thumbUrl: "https://example.com/project-cover-thumb.jpg",
        publicId: "projects/covers/visibility"
      },
      phases: []
    });

    const document = await ProjectDocument.create({
      project: project._id,
      title: "Documento inicial",
      category: "plano",
      fileUrl: "https://example.com/document.pdf",
      publicId: "projects/documents/document-initial",
      uploadedBy: admin._id,
      isVisibleToClient: false
    });

    return { client, architect, admin, project, document };
  };

  it("debe permitir que un admin cambie la visibilidad del documento", async () => {
    const { admin, document } = await createBaseData();
    const token = buildToken(admin);

    const res = await request(app)
      .patch(`/api/v1/projects-documents/${document._id}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isVisibleToClient: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Visibilidad actualizada.");
    expect(res.body.document.isVisibleToClient).toBe(true);

    const updatedDoc = await ProjectDocument.findById(document._id);
    expect(updatedDoc).not.toBeNull();
    expect(updatedDoc.isVisibleToClient).toBe(true);
  });

  it("debe responder 403 si un architect intenta cambiar la visibilidad", async () => {
    const { architect, document } = await createBaseData();
    const token = buildToken(architect);

    const res = await request(app)
      .patch(`/api/v1/projects-documents/${document._id}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isVisibleToClient: true });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Solo admin.");
  });

  it("debe responder 403 si un user normal intenta cambiar la visibilidad", async () => {
    const { client, document } = await createBaseData();
    const token = buildToken(client);

    const res = await request(app)
      .patch(`/api/v1/projects-documents/${document._id}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isVisibleToClient: true });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Solo admin.");
  });

  it("debe responder 404 si el documento no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/v1/projects-documents/${fakeId}/visibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isVisibleToClient: true });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Documento no encontrado.");
  });
});