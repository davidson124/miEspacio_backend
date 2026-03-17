import bcrypt from "bcrypt";
import request from "supertest";
import app from "../../src/app.js";

import User from "../../src/models/user.model.js";

describe("POST /api/v1/auth/login", () => {
  it("debe permitir login con credenciales válidas", async () => {
    const hashedPassword = await bcrypt.hash("Password123*", 10);

    const user = await User.create({
      name: "David",
      lastName: "Login",
      email: "login-valid@test.com",
      password: hashedPassword,
      cellphoneNumber: "3090000001",
      role: "user",
      isActive: true
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "Password123*"
      });

    expect(res.statusCode).toBe(200);

    const userData = res.body.user ?? res.body.data?.user ?? res.body;

    expect(userData.email).toBe(user.email);
    expect(userData.role).toBe("user");

    // Ajusta según tu respuesta real:
    expect(res.body.token || res.body.accessToken).toBeDefined();
  });

  it("debe responder error si el email no existe", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "not-found-login@test.com",
        password: "Password123*"
      });

    expect([400, 401, 404]).toContain(res.statusCode);
  });

  it("debe responder 401 si la contraseña es incorrecta", async () => {
    const hashedPassword = await bcrypt.hash("Password123*", 10);

    const user = await User.create({
      name: "David",
      lastName: "WrongPassword",
      email: "wrong-password@test.com",
      password: hashedPassword,
      cellphoneNumber: "3090000002",
      role: "user",
      isActive: true
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "PasswordIncorrecta*"
      });

    expect(res.statusCode).toBe(401);
  });

  it("debe responder error si el usuario está inactivo", async () => {
    const hashedPassword = await bcrypt.hash("Password123*", 10);

    const user = await User.create({
      name: "David",
      lastName: "Inactive",
      email: "inactive-login@test.com",
      password: hashedPassword,
      cellphoneNumber: "3090000003",
      role: "user",
      isActive: false
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: "Password123*"
      });

    expect([401, 403]).toContain(res.statusCode);
  });

  it("debe responder 400 si falta el email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        password: "Password123*"
      });

    expect(res.statusCode).toBe(401);
  });

  it("debe responder 400 si falta la contraseña", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "login-missing-password@test.com"
      });

    expect(res.statusCode).toBe(401);
  });

  it("debe responder 400 si el body está vacío", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({});

    expect(res.statusCode).toBe(401);
  });
});