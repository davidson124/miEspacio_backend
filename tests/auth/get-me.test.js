import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";

describe("GET /api/v1/auth/me", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  it("debe permitir que un user autenticado obtenga su perfil", async () => {
    const user = await User.create({
      name: "David",
      lastName: "User",
      email: "auth-me-user@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3110000001",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Perfil obtenido correctamente.");
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.role).toBe("user");
    expect(res.body.user.password).toBeUndefined();
  });

  it("debe permitir que un architect autenticado obtenga su perfil", async () => {
    const architect = await User.create({
      name: "Ana",
      lastName: "Architect",
      email: "auth-me-architect@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3110000002",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Perfil obtenido correctamente.");
    expect(res.body.user.email).toBe(architect.email);
    expect(res.body.user.role).toBe("architect");
    expect(res.body.user.password).toBeUndefined();
  });

  it("debe permitir que un admin autenticado obtenga su perfil", async () => {
    const admin = await User.create({
      name: "Carlos",
      lastName: "Admin",
      email: "auth-me-admin@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3110000003",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Perfil obtenido correctamente.");
    expect(res.body.user.email).toBe(admin.email);
    expect(res.body.user.role).toBe("admin");
    expect(res.body.user.password).toBeUndefined();
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });

  it("debe responder 401 si el token es inválido", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer token-invalido");

    expect(res.statusCode).toBe(401);
  });

  it("debe responder 401 si el usuario autenticado no existe", async () => {
    const fakeToken = jwt.sign(
      { id: "507f1f77bcf86cd799439011", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(401);
  });

  it("debe responder 401 si el usuario está inactivo", async () => {
    const inactiveUser = await User.create({
      name: "Laura",
      lastName: "Inactive",
      email: "auth-me-inactive@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3110000004",
      role: "user",
      isActive: false
    });

    const token = buildToken(inactiveUser);

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
  });
});