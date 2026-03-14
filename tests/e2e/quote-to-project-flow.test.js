import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("E2E - quote to project flow", () => {
  it("debe completar el flujo: crear quote -> generar propuesta -> aceptar -> crear proyecto", async () => {
    // Admin
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-e2e@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });
    // Cliente
    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-e2e@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });
    // Arquitecto
    const architect = await User.create({
      name: "Carlos",
      lastName: "Arquitecto",
      email: "architect-e2e@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003333333",
      role: "architect",
      isActive: true
    });
    // Servicio
    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true
    });
    // Tokens
    const adminToken = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );
    const clientToken = jwt.sign(
      { id: client._id.toString(), role: client.role },
      process.env.JWT_SECRET
    );
    //PASO 1: Cliente crea cotización
    const createQuoteRes = await request(app)
      .post("/api/v1/quotes")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        projectType: "residencial",
        serviceId: service._id.toString(),
        estimatedBudget: 5000000,
        estimatedTime: "3-6 meses",
        location: "Bogotá",
        description: "Casa moderna con patio interior",
        preferredContactMethod: "email"
      });
    expect(createQuoteRes.statusCode).toBe(201);
    expect(createQuoteRes.body.quote.status).toBe("pendiente");

    const quoteId = createQuoteRes.body.quote._id;
    //PASO 2: Admin genera propuesta
    const proposalRes = await request(app)
      .patch(`/api/v1/quotes/${quoteId}/proposal`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        tax: 19,
        validUntil: "2026-12-31",
        notes: "Incluye dos revisiones.",
        items: [
          {
            description: "Diseño arquitectónico",
            quantity: 1,
            unitPrice: 2000000
          },
          {
            description: "Supervisión técnica",
            quantity: 2,
            unitPrice: 500000
          }
        ]
      });

    expect(proposalRes.statusCode).toBe(200);
    expect(proposalRes.body.quote.status).toBe("propuesta_generada");
    expect(proposalRes.body.quote.proposalData.subtotal).toBe(3000000);
    expect(proposalRes.body.quote.proposalData.total).toBe(3570000);
    //PASO 3: Cliente acepta cotización
    const acceptRes = await request(app)
      .patch(`/api/v1/quotes/${quoteId}/accept`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(acceptRes.statusCode).toBe(200);
    expect(acceptRes.body.quote.status).toBe("aprobada");
    expect(acceptRes.body.quote.isAcceptedByClient).toBe(true);
    expect(acceptRes.body.quote.acceptedAt).toBeDefined();
    //PASO 4: Admin crea proyecto desde cotización aprobada
    const createProjectRes = await request(app)
      .post(`/api/v1/projects/from-quote/${quoteId}`)
      .set("Authorization", `Bearer ${adminToken}`)
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

    expect(createProjectRes.statusCode).toBe(201);
    expect(createProjectRes.body.project).toBeDefined();
    expect(createProjectRes.body.project.title).toBe("Casa Moderna Vista Lago");
    expect(createProjectRes.body.project.client.toString()).toBe(client._id.toString());
    expect(createProjectRes.body.project.architect.toString()).toBe(architect._id.toString());
    expect(createProjectRes.body.quote.status).toBe("contratada");
    expect(createProjectRes.body.quote.project).toBeDefined();
    // VERIFICACIÓN FINAL EN BASE DE DATOS
    const finalQuote = await Quote.findById(quoteId);
    const finalProject = await Project.findById(createProjectRes.body.project._id);
    expect(finalQuote).not.toBeNull();
    expect(finalProject).not.toBeNull();
    expect(finalQuote.status).toBe("contratada");
    expect(finalQuote.project.toString()).toBe(finalProject._id.toString());
    expect(finalProject.relatedQuote.toString()).toBe(finalQuote._id.toString());
  });
});
