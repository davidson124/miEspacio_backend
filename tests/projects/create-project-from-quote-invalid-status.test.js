import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("POST /api/v1/projects/from-quote/:quoteId", () => {
  it("no debe crear un proyecto si la cotización no está aprobada", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-invalid@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });

    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-invalid@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });

    const architect = await User.create({
      name: "Carlos",
      lastName: "Arquitecto",
      email: "architect-invalid@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3003333333",
      role: "architect",
      isActive: true
    });

    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true
    });

    // Quote NO aprobada
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
      status: "propuesta_generada", // <- todavía no aprobada
      isAcceptedByClient: false,
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

    const adminToken = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post(`/api/v1/projects/from-quote/${quote._id}`)
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

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/debe estar aprobada/i);

    // Verificar que NO se creó proyecto
    const projects = await Project.find();
    expect(projects).toHaveLength(0);

    // Verificar que la quote sigue sin proyecto
    const unchangedQuote = await Quote.findById(quote._id);
    expect(unchangedQuote.project).toBeUndefined();
    expect(unchangedQuote.status).toBe("propuesta_generada");
  });
});