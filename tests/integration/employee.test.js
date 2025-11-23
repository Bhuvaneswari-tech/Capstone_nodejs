// // require('dotenv').config();
// // const request = require("supertest");
// // const app = require("../../app");
// // const mongoose = require("mongoose");

// // beforeAll(async () => {
// //   // connect mongoose BEFORE running tests
// //   await mongoose.connect(process.env.MONGO_URI_TEST);
// // });

// // // afterAll(async () => {
// // //   await mongoose.connection.db.dropDatabase();
// // //   await mongoose.disconnect();
// // // });

// // afterAll(async () => {
// //   const collections = Object.keys(mongoose.connection.collections);
// //   for (const collectionName of collections) {
// //     await mongoose.connection.collections[collectionName].deleteMany({});
// //   }
// //   await mongoose.disconnect();
// // });

// require('dotenv').config();
// const request = require("supertest");
// const app = require("../../app");
// const mongoose = require("mongoose");

// jest.setTimeout(30000); // <-- Increase timeout

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI_TEST);
// });

// afterAll(async () => {
//   const collections = Object.keys(mongoose.connection.collections);
//   for (const collectionName of collections) {
//     await mongoose.connection.collections[collectionName].deleteMany({});
//   }
//   await mongoose.disconnect();
// });


// describe("Employee API", () => {
//   let token;
//   test("register + login", async () => {
//     await request(app)
//       .post("/api/v1/auth/register")
//       .send({ username: "admin", email: "a@a.com", password: "pass123", role: "admin" });
    
//     const res = await request(app)
//       .post("/api/v1/auth/login")
//       .send({ username: "admin", password: "pass123" });
    
//     expect(res.statusCode).toBe(200);
//     token = res.body.accessToken;
//     expect(token).toBeTruthy();
//   });

//   test("create employee (admin)", async () => {
//     const res = await request(app)
//       .post("/api/v1/employees")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ name: "Alice", department: "HR", salary: 50000 });
    
//     expect(res.statusCode).toBe(201);
//     expect(res.body.name).toBe("Alice");
//   });

//   test("list employees", async () => {
//     const res = await request(app)
//       .get("/api/v1/employees")
//       .set("Authorization", `Bearer ${token}`);
    
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });
// });


// Load environment variables
require('dotenv').config();

const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

// Increase Jest timeout for slow Atlas connections
jest.setTimeout(30000); // 30 seconds

// Connect to MongoDB before running tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected for tests");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
});

// Cleanup collections after tests (Atlas does not allow dropDatabase)
afterAll(async () => {
  try {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].deleteMany({});
    }
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected and test data cleared");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  }
});

describe("Employee API", () => {
  let token;

  test("Register + Login", async () => {
    // Register admin user
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "admin", email: "a@a.com", password: "pass123", role: "admin" });

    // Login admin user
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "admin", password: "pass123" });

    expect(res.statusCode).toBe(200);
    token = res.body.accessToken;
    expect(token).toBeTruthy();
    console.log("✅ Admin registered and logged in, token obtained");
  });

  test("Create employee (admin)", async () => {
    const res = await request(app)
      .post("/api/v1/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Alice", department: "HR", salary: 50000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Alice");
    console.log("✅ Employee created successfully");
  });

  test("List employees", async () => {
    const res = await request(app)
      .get("/api/v1/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    console.log("✅ Employees listed successfully");
  });
});




