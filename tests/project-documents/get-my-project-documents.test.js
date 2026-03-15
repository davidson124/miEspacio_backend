import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";
import ProjectDocument from "../../src/models/projectDocument.model.js";

describe("GET /api/v1/project-documents/my", () => {
  it("debe devolver solo los documentos visibles de los proyectos del usuario autenticado", async () => {
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "docs@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "user",
      isActive: true
    });
    const otherUser = await User.create({
      name: "Juan",
      lastName: "Pérez",
      email: "otherdocs@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });
    const architect = await User.create({
      name: "Carlos",
      lastName: "Arquitecto",
      email: "architect-docs@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003333333",
      role: "architect",
      isActive: true
    });
    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas"],
      isActive: true
    });
    const quote = await Quote.create({
      user: user._id,
      clientSnapshot: {
        name: user.name,
        lastName: user.lastName,
        email: user.email
      },
      projectType: "residencial",
      service: service._id,
      serviceSnapshot: {
        title: service.title
      },
      estimatedBudget: 5000000,
      estimatedTime: "3-6 meses",
      location: "Bogotá",
      status: "aprobada",
      isAcceptedByClient: true
    });
    const project = await Project.create({
      title: "Proyecto Casa Moderna",
      client: user._id,
      architect: architect._id,
      relatedQuote: quote._id,
      budget: 5000000,
      location: {
        city: "Bogotá",
        country: "Colombia"
      },
      areaM2: 180,
      cover: {
        url: "https://example.com/project-cover.jpg",
        thumbUrl: "https://example.com/project-cover-thumb.jpg",
        publicId: "projects/covers/test-cover"
      },
      phases: []
    });
    const otherQuote = await Quote.create({
      user: otherUser._id,
      clientSnapshot: {
        name: otherUser.name,
        lastName: otherUser.lastName,
        email: otherUser.email
      },
      projectType: "comercial",
      service: service._id,
      serviceSnapshot: {
        title: service.title
      },
      estimatedBudget: 6000000,
      estimatedTime: "6-12 meses",
      location: "Medellín",
      status: "aprobada",
      isAcceptedByClient: true
    });
    const otherProject = await Project.create({
      title: "Proyecto Ajeno",
      client: otherUser._id,
      architect: architect._id,
      relatedQuote: otherQuote._id,
      budget: 6000000,
      location: {
        city: "Medellín",
        country: "Colombia"
      },
      areaM2: 210,
      cover: {
        url: "https://example.com/project-cover-2.jpg",
        thumbUrl: "https://example.com/project-cover-2-thumb.jpg",
        publicId: "projects/covers/test-cover-2"
      },
      phases: []
    });
    // Documento visible del usuario autenticado
    await ProjectDocument.create({
      project: project._id,
      title: "Plano arquitectónico",
      category: "plano",
      fileUrl: "https://example.com/plano.pdf",
      publicId: "projects/documents/plano-1",
      uploadedBy: architect._id,
      isVisibleToClient: true
    });
    // Documento oculto del usuario autenticado (no debe aparecer)
    await ProjectDocument.create({
      project: project._id,
      title: "Documento interno",
      category: "plano",
      fileUrl: "https://example.com/interno.pdf",
      publicId: "projects/documents/interno-1",
      uploadedBy: architect._id,
      isVisibleToClient: false
    });
    // Documento visible pero de otro usuario (no debe aparecer)
    await ProjectDocument.create({
      project: otherProject._id,
      title: "Documento ajeno",
      category: "plano",
      fileUrl: "https://example.com/ajeno.pdf",
      publicId: "projects/documents/ajeno-1",
      uploadedBy: architect._id,
      isVisibleToClient: true
    });
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .get("/api/v1/projects-documents/my")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.documents).toHaveLength(1);
    expect(res.body.documents[0].title).toBe("Plano arquitectónico");
    expect(res.body.documents[0].isVisibleToClient).toBe(true);
  });
});