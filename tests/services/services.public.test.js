import request from "supertest";
import app from "../../src/app.js";
import Service from "../../src/models/service.model.js";

describe("GET /api/v1/services", () => {
  it("debe devolver solo servicios activos", async () => {
    await Service.create([
      {
        title: "Diseño Residencial",
        description: "Servicio activo",
        features: ["Casas", "Remodelaciones"],
        isActive: true
      },
      {
        title: "Servicio oculto",
        description: "No debería verse",
        features: ["Interno"],
        isActive: false
      }
    ]);

    const res = await request(app).get("/api/v1/services");

    expect(res.statusCode).toBe(200);
    expect(res.body.services).toHaveLength(1);
    expect(res.body.services[0].title).toBe("Diseño Residencial");
  });
});