import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("POST /api/v1/projects/from-quote/:quoteId", () => {
  it("debe permitir que un arquitecto cree un proyecto desde una cotización aprobada", async () => {
    // Arquitecto que ejecuta la acción
    const architect = await User.create({
      name: "Carlos",
      lastName: "Arquitecto",
      email: "architect-allowed@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "architect",
      isActive: true
    });
    // Cliente dueño de la cotización
    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-allowed@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });
    // Servicio
    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true
    });
    // Quote aprobada y aceptada
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
      estimatedBudget: 5000000,
      estimatedTime: "3-6 meses",
      location: "Bogotá",
      description: "Casa moderna",
      preferredContactMethod: "email",
      status: "aprobada",
      isAcceptedByClient: true,
      acceptedAt: new Date(),
      proposalData: {
        items: [
          {
            description: "Diseño arquitectónico",
            quantity: 1,
            unitPrice: 2000000,
            total: 2000000
          }
        ],
        subtotal: 2000000,
        tax: 19,
        total: 2380000,
        validUntil: new Date(),
        notes: "Incluye una revisión"
      }
    });
    const architectToken = jwt.sign(
      { id: architect._id.toString(), role: architect.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .post(`/api/v1/projects/from-quote/${quote._id}`)
      .set("Authorization", `Bearer ${architectToken}`)
      .send({
        architectId: architect._id.toString(),
        title: "Casa Moderna Vista Lago",
        budget: 8500000,
        location: {
          city: "Bogotá",
          country: "Colombia"
        },
        areaM2: 320,
        startDate: "2026-03-10",
        estimatedEndDate: "2026-10-15",
        cover: {
          url: "https://example.com/cover.jpg",
          thumbUrl: "https://example.com/cover-thumb.jpg",
          publicId: "projects/covers/test-cover"
        }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.project).toBeDefined();
    expect(res.body.project.architect.toString()).toBe(architect._id.toString());
    expect(res.body.project.client.toString()).toBe(client._id.toString());
    expect(res.body.quote.status).toBe("contratada");
    expect(res.body.quote.project).toBeDefined();
    // Verificar en base de datos
    const savedProject = await Project.findById(res.body.project._id);
    const updatedQuote = await Quote.findById(quote._id);
    expect(savedProject).not.toBeNull();
    expect(updatedQuote.status).toBe("contratada");
    expect(updatedQuote.project.toString()).toBe(savedProject._id.toString());
  });
});