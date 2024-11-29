import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../index.js";

let mongoServer;

beforeAll(async () => {
  // Set up an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();

  // Connect to the MongoDB server
  await mongoose.disconnect(); // Ensure no active connections
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Clean up and disconnect from MongoDB
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Patient API Integration Tests", () => {
    it("should add a test for a patient", async () => {
        // Step 1: Add a new patient
        const newPatient = await request(app).post("/patients").send({
          name: "John Doe",
          age: 30,
          gender: "Male",
        });
    
        // Step 2: Add a test for the newly created patient
        const testResponse = await request(app).post(`/patients/${newPatient.body._id}/tests`).send({
          type: "Blood Pressure",
          value: "120/80",
          dateTime: new Date().toISOString(),
        });
    
        expect(testResponse.status).toBe(201);
    
        // Step 3: Retrieve the stored test using ObjectId (use new to instantiate ObjectId)
        const storedTest = await mongoose.connection.db
          .collection("tests")
          .findOne({ patientId: new mongoose.Types.ObjectId(newPatient.body._id) });
    
        expect(storedTest).not.toBeNull();
        expect(storedTest.type).toBe("Blood Pressure");
      });

  it("should retrieve all patients", async () => {
    // Add a patient to ensure the list is not empty
    await request(app).post("/api/patients").send({ name: "Jane Doe", age: 40, gender: "Female" });

    const response = await request(app).get("/api/patients");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); // Ensure patients exist in the response
  });

  it("should retrieve a specific patient by ID", async () => {
    const newPatient = await request(app)
      .post("/api/patients")
      .send({ name: "Jane Smith", age: 50, gender: "Female" });

    const response = await request(app).get(`/api/patients/${newPatient.body._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Jane Smith");
    expect(response.body.age).toBe(50);
    expect(response.body.gender).toBe("Female");
  });

  it("should add a test for a patient", async () => {
    const newPatient = await request(app)
      .post("/api/patients")
      .send({ name: "John Smith", age: 45, gender: "Male" });

    const testResponse = await request(app)
      .post(`/api/patients/${newPatient.body._id}/tests`)
      .send({ type: "Blood Pressure", value: "120/80" });

    expect(testResponse.statusCode).toBe(201);
    expect(testResponse.body.type).toBe("Blood Pressure");

    // Verify the test is stored in the database
    const storedTest = await mongoose.connection.db
      .collection("tests")
      .findOne({ patientId: mongoose.Types.ObjectId(newPatient.body._id) });

    expect(storedTest).not.toBeNull();
    expect(storedTest.type).toBe("Blood Pressure");
    expect(storedTest.value).toBe("120/80");
  });

  it("should retrieve all tests for a patient", async () => {
    const newPatient = await request(app)
      .post("/api/patients")
      .send({ name: "Anna Brown", age: 50, gender: "Female" });

    // Add a test for the patient
    await request(app)
      .post(`/api/patients/${newPatient.body._id}/tests`)
      .send({ type: "Respiratory Rate", value: "18" });

    const testResponse = await request(app).get(`/api/patients/${newPatient.body._id}/tests`);

    expect(testResponse.statusCode).toBe(200);
    expect(Array.isArray(testResponse.body)).toBe(true);
    expect(testResponse.body.length).toBeGreaterThan(0);
    expect(testResponse.body[0].type).toBe("Respiratory Rate");
    expect(testResponse.body[0].value).toBe("18");
  });
});
