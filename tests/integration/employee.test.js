require('dotenv').config();
const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

beforeAll(async () => {
  // connect mongoose BEFORE running tests
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Employee API", () => {
  let token;
  test("register + login", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "admin", email: "a@a.com", password: "pass123", role: "admin" });
    
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "admin", password: "pass123" });
    
    expect(res.statusCode).toBe(200);
    token = res.body.accessToken;
    expect(token).toBeTruthy();
  });

  test("create employee (admin)", async () => {
    const res = await request(app)
      .post("/api/v1/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Alice", department: "HR", salary: 50000 });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Alice");
  });

  test("list employees", async () => {
    const res = await request(app)
      .get("/api/v1/employees")
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});






