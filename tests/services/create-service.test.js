import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

describe("POST /api/v1/services", () => {
  it("debe permitir que un admin cree un servicio", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin-create-service@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3001111111",
      role: "admin",
      isActive: true
    });
    const adminToken = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET
    );
    const payload = {
      title: "Diseño Residencial",
      description: "Creamos hogares únicos y funcionales.",
      features: [
        "Diseño de casas unifamiliares",
        "Remodelaciones completas",
        "Ampliaciones"
      ],
      image: {
        url: "https://example.com/service.jpg",
        thumbUrl: "https://example.com/service-thumb.jpg",
        publicId: "services/test-service"
      },
      order: 1
    };
    const res = await request(app)
      .post("/api/v1/services")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.service).toBeDefined();
    expect(res.body.service.title).toBe("Diseño Residencial");
    expect(res.body.service.description).toBe("Creamos hogares únicos y funcionales.");
    expect(res.body.service.features).toHaveLength(3);
    expect(res.body.service.image.url).toBe("https://example.com/service.jpg");
    expect(res.body.service.order).toBe(1);

    const savedService = await Service.findById(res.body.service._id);
    expect(savedService).not.toBeNull();
    expect(savedService.title).toBe("Diseño Residencial");
  });
});