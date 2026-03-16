import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

describe("PATCH /api/v1/services/:id/toggle", () => {
  it("debe permitir que un admin desactive un servicio activo", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-toggle-service@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });
    const service = await Service.create({
      title: "Diseño Residencial",
      description: "Servicio activo",
      features: ["Casas", "Remodelaciones"],
      isActive: true,
      order: 1
    });
    const token = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .patch(`/api/v1/services/${service._id}/toggle`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.service).toBeDefined();
    expect(res.body.service.isActive).toBe(false);
    const updatedService = await Service.findById(service._id);
    expect(updatedService.isActive).toBe(false);
  });
  it("debe permitir que un admin active un servicio inactivo", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-toggle-service-2@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3002222222",
      role: "admin",
      isActive: true
    });
    const service = await Service.create({
      title: "Interiorismo",
      description: "Servicio inactivo",
      features: ["Mobiliario", "Espacios"],
      isActive: false,
      order: 2
    });
    const token = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );
    const res = await request(app)
      .patch(`/api/v1/services/${service._id}/toggle`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.service).toBeDefined();
    expect(res.body.service.isActive).toBe(true);
    const updatedService = await Service.findById(service._id);
    expect(updatedService.isActive).toBe(true);
  });
});