import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";
import Quote from "../../src/models/quote.model.js";

describe("GET /api/v1/quotes/my", () => {
  it("debe devolver solo las cotizaciones del usuario autenticado", async () => {
    // Usuario dueño de las cotizaciones
    const user = await User.create({
      name: "David",
      lastName: "Quintero",
      email: "myquotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001234567",
      role: "user",
      isActive: true
    });
    // Otro usuario
    const otherUser = await User.create({
      name: "Juan",
      lastName: "Pérez",
      email: "otherquotes@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3007654321",
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
    // Quotes del usuario autenticado
    await Quote.create([
      {
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
        description: "Casa moderna",
        preferredContactMethod: "email",
        status: "pendiente"
      },
      {
        user: user._id,
        clientSnapshot: {
          name: user.name,
          lastName: user.lastName,
          email: user.email
        },
        projectType: "comercial",
        service: service._id,
        serviceSnapshot: {
          title: service.title
        },
        estimatedBudget: 8000000,
        estimatedTime: "6-12 meses",
        location: "Medellín",
        description: "Local comercial",
        preferredContactMethod: "telefono",
        status: "propuesta_generada",
        proposalData: {
          items: [
            {
              description: "Diseño comercial",
              quantity: 1,
              unitPrice: 3000000,
              total: 3000000
            }
          ],
          subtotal: 3000000,
          tax: 19,
          total: 3570000
        }
      }
    ]);
    // Quote de otro usuario (no debe aparecer)
    await Quote.create({
      user: otherUser._id,
      clientSnapshot: {
        name: otherUser.name,
        lastName: otherUser.lastName,
        email: otherUser.email
      },
      projectType: "interiores",
      service: service._id,
      serviceSnapshot: {
        title: service.title
      },
      estimatedBudget: 2000000,
      estimatedTime: "1-3 meses",
      location: "Cali",
      description: "Diseño interior",
      preferredContactMethod: "email",
      status: "pendiente"
    });
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .get("/api/v1/quotes/my")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.quotes).toHaveLength(2);
    // Verifica que todas pertenezcan al usuario autenticado
    for (const quote of res.body.quotes) {
      expect(quote.user.toString()).toBe(user._id.toString());
    }
    // Verifica que venga el serviceTitle resuelto
    expect(res.body.quotes[0].serviceTitle).toBe("Diseño Residencial");
    expect(res.body.quotes[1].serviceTitle).toBe("Diseño Residencial");
  });
});
