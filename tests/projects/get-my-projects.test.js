import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";
import Project from "../../src/models/project.model.js";

describe("GET /api/v1/projects/my", () => {
  it("debe devolver solo los proyectos del usuario autenticado", async () => {
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "projects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "user",
      isActive: true
    });
    const otherUser = await User.create({
      name: "Juan",
      lastName: "Perez",
      email: "otherprojects@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "user",
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
    const architect = await User.create({
    name: "Carlos",
    lastName: "Arquitecto",
    email: "architect-projects@test.com",
    password: "hashedPassword",
    cellphoneNumber: "3003333333",
    role: "architect",
    isActive: true
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
  phases: [
    {
      name: "Anteproyecto",
      progress: 30
    }
  ]
});
// Proyecto de otro usuario
await Project.create({
  title: "Proyecto que no debe aparecer",
  client: otherUser._id,
  architect: architect._id,
  relatedQuote: quote._id,
  budget: 7000000,
  location: {
    city: "Medellín",
    country: "Colombia"
  },
  areaM2: 220,
  cover: {
    url: "https://example.com/project-cover-2.jpg",
    thumbUrl: "https://example.com/project-cover-2-thumb.jpg",
    publicId: "projects/covers/test-cover-2"
  },
  phases: []
});
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .get("/api/v1/projects/my")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.projects.length).toBe(1);
    expect(res.body.projects[0].title).toBe("Proyecto Casa Moderna");
  });
});
