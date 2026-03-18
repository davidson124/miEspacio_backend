import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";

describe("GET /api/v1/auth/profile", () => {
  const buildToken = (user) =>
    jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

  it("debe permitir que un user autenticado obtenga su perfil", async () => {
    const user = await User.create({
      name: "David",
      lastName: "Profile",
      email: "profile-user@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3100000001",
      role: "user",
      isActive: true
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const profile = res.body.user ?? res.body.profile ?? res.body;

    expect(profile.email).toBe(user.email);
    expect(profile.role).toBe("user");
  });

  it("debe permitir que un architect autenticado obtenga su perfil", async () => {
    const architect = await User.create({
      name: "Architect",
      lastName: "Profile",
      email: "profile-architect@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3100000002",
      role: "architect",
      isActive: true
    });

    const token = buildToken(architect);

    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const profile = res.body.user ?? res.body.profile ?? res.body;

    expect(profile.email).toBe(architect.email);
    expect(profile.role).toBe("architect");
  });

  it("debe permitir que un admin autenticado obtenga su perfil", async () => {
    const admin = await User.create({
      name: "Admin",
      lastName: "Profile",
      email: "profile-admin@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3100000003",
      role: "admin",
      isActive: true
    });

    const token = buildToken(admin);

    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const profile = res.body.user ?? res.body.profile ?? res.body;

    expect(profile.email).toBe(admin.email);
    expect(profile.role).toBe("admin");
  });

  it("debe responder 401 si el token es inválido", async () => {
    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer token-invalido`);

    expect(res.statusCode).toBe(401);
  });

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).get("/api/v1/auth/profile");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });

  it("debe responder error si el usuario está inactivo", async () => {
    const user = await User.create({
      name: "Inactive",
      lastName: "Profile",
      email: "profile-inactive@test.com",
      password: "hashedPassword",
      cellphoneNumber: "3100000004",
      role: "user",
      isActive: false
    });

    const token = buildToken(user);

    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect([401, 403, 404]).toContain(res.statusCode);
  });
});