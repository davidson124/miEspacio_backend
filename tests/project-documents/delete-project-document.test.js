import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";
import ProjectDocument from "../../src/models/projectDocument.model.js";

describe("DELETE /api/v1/projects-documents/:id", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
  const createBaseData = async () => {
    const client = await User.create({
      name: "Cliente",
      lastName: "Delete",
      email: "client-delete-doc@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003000001",
      role: "user",
      isActive: true
    });
    const architect = await User.create({
      name: "Architect",
      lastName: "Delete",
      email: "architect-delete-doc@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003000002",
      role: "architect",
      isActive: true
    });
    const admin = await User.create({
      name: "Admin",
      lastName: "Delete",
      email: "admin-delete-doc@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003000003",
      role: "admin",
      isActive: true
    });
    const service = await Service.create({
      title: "Servicio Delete",
      description: "Servicio para pruebas delete",
      features: ["Feature A", "Feature B"],
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
      estimatedBudget: 10000000,
      estimatedTime: "1-3 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });
    const project = await Project.create({
      title: "Proyecto Delete",
      client: client._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 10000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 110,
      cover: {
        url: "https://example.com/project-cover.jpg",
        thumbUrl: "https://example.com/project-cover-thumb.jpg",
        publicId: "projects/covers/delete"
      },
      phases: []
    });
    const document = await ProjectDocument.create({
      project: project._id,
      title: "Documento para eliminar",
      category: "plano",
      fileUrl: "https://example.com/document-delete.pdf",
      publicId: undefined,
      uploadedBy: admin._id,
      isVisibleToClient: true
    });
    return { client, architect, admin, project, document };
  };

  it("debe permitir que un admin elimine un documento correctamente", async () => {
  const { admin, document } = await createBaseData();
  const token = buildToken(admin);

  const res = await request(app)
    .delete(`/api/v1/projects-documents/${document._id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Documento eliminado correctamente.");

  const deletedDoc = await ProjectDocument.findById(document._id);
  expect(deletedDoc).not.toBeNull();
  expect(deletedDoc.isDeleted).toBe(true);
});

  it("debe responder 403 si un architect intenta eliminar un documento", async () => {
    const { architect, document } = await createBaseData();
    const token = buildToken(architect);

    const res = await request(app)
      .delete(`/api/v1/projects-documents/${document._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Solo admin puede eliminar documentos.");
  });

  it("debe responder 403 si un user normal intenta eliminar un documento", async () => {
    const { client, document } = await createBaseData();
    const token = buildToken(client);

    const res = await request(app)
      .delete(`/api/v1/projects-documents/${document._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Solo admin puede eliminar documentos.");
  });

  it("debe responder 404 si el documento no existe", async () => {
    const { admin } = await createBaseData();
    const token = buildToken(admin);
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/v1/projects-documents/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Documento no encontrado.");
  });
  it("debe responder 401 si no se envía token", async () => {
  const { document } = await createBaseData();

  const res = await request(app)
    .delete(`/api/v1/projects-documents/${document._id}`);

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Token requerido");
});
});