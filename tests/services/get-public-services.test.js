import request from "supertest";
import app from "../../src/app.js";

import Service from "../../src/models/service.model.js";

describe("GET /api/v1/services/public", () => {
  it("debe devolver solo los servicios públicos activos", async () => {
    await Service.create({
      title: "Servicio activo 1",
      description: "Visible públicamente",
      features: ["Feature 1", "Feature 2"],
      isActive: true
    });

    await Service.create({
      title: "Servicio activo 2",
      description: "También visible públicamente",
      features: ["Feature A", "Feature B"],
      isActive: true
    });

    await Service.create({
      title: "Servicio inactivo",
      description: "No debería aparecer",
      features: ["Feature X"],
      isActive: false
    });

    const res = await request(app).get("/api/v1/services/public");

    expect(res.statusCode).toBe(200);

    const services = res.body.services ?? res.body;

    expect(Array.isArray(services)).toBe(true);
    expect(services).toHaveLength(2);

    const titles = services.map((service) => service.title);
    expect(titles).toContain("Servicio activo 1");
    expect(titles).toContain("Servicio activo 2");
    expect(titles).not.toContain("Servicio inactivo");
  });

  it("debe devolver 200 y un arreglo vacío si no existen servicios activos", async () => {
    await Service.create({
      title: "Servicio inactivo único",
      description: "No debería aparecer",
      features: ["Feature X"],
      isActive: false
    });

    const res = await request(app).get("/api/v1/services/public");

    expect(res.statusCode).toBe(200);

    const services = res.body.services ?? res.body;

    expect(Array.isArray(services)).toBe(true);
    expect(services).toHaveLength(0);
  });

  it("debe funcionar sin token", async () => {
    await Service.create({
      title: "Servicio libre",
      description: "Acceso público",
      features: ["Feature Public"],
      isActive: true
    });

    const res = await request(app).get("/api/v1/services/public");

    expect(res.statusCode).toBe(200);

    const services = res.body.services ?? res.body;

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });
});