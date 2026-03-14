import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("POST /api/v1/projects/from-quote/:quoteId", () => {
  it("debe impedir que un usuario normal cree un proyecto desde una cotización", async () => {
    // Usuario normal que intentará crear el proyecto
    const normalUser = await User.create({
      name: "Usuario",
      lastName: "Normal",
      email: "user-forbidden@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "user",
      isActive: true
    });
    // Cliente dueño de la cotización
    const client = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "client-forbidden@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
      isActive: true
    });
    // Arquitecto válido
    const architect = await User.create({
      name: "Carlos",
      lastName: "Arquitecto",
      email: "architect-forbidden@test.com",
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

    const userToken = jwt.sign(
      { id: normalUser._id.toString(), role: normalUser.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .post(`/api/v1/projects/from-quote/${quote._id}`)
      .set("Authorization", `Bearer ${userToken}`)
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
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/acceso denegado|no autorizado/i);
    // Verificar que NO se creó proyecto
    const projects = await Project.find();
    expect(projects).toHaveLength(0);
    // Verificar que la quote sigue intacta
    const unchangedQuote = await Quote.findById(quote._id);
    expect(unchangedQuote.status).toBe("aprobada");
    expect(unchangedQuote.project).toBeFalsy();
  });
});