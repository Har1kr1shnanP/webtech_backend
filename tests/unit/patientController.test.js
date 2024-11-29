import { 
    addPatient, 
    getAllPatients, 
    getPatientById, 
    addTestForPatient, 
    getTestsForPatient, 
    getPatientHistory, 
    getCriticalPatients, 
    updatePatientCriticalCondition 
  } from "../../controller/patientController.js";


  
  import Test from "../../model/testsModel.js";
  import Patient from "../../model/patientModel.js";
  
  jest.mock("../../model/testsModel.js");
  jest.mock("../../model/patientModel.js");
  
  describe("Patient Controller Unit Tests", () => {
    it("should add a new patient", async () => {
        const req = {
          body: {
            name: "John Doe",
            age: 30,
            gender: "Male",
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        Patient.create.mockResolvedValue({ _id: "12345", ...req.body });
    
        await addPatient(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: "12345", ...req.body });
      });
      
  
    it("should retrieve all patients", async () => {
      const patients = [{ name: "Jane Doe", age: 40 }];
      Patient.find.mockResolvedValue(patients);
  
      const req = {};
      const res = { json: jest.fn() };
  
      await getAllPatients(req, res);
  
      expect(res.json).toHaveBeenCalledWith(patients);
    });
  
    it("should retrieve a patient by ID", async () => {
      const patient = { name: "John Doe", age: 30, gender: "Male" };
      Patient.findById.mockResolvedValue(patient);
  
      const req = { params: { id: "12345" } };
      const res = { json: jest.fn() };
  
      await getPatientById(req, res);
  
      expect(res.json).toHaveBeenCalledWith(patient);
    });
  
    it("should add a test for a patient", async () => {
        const req = {
          body: {
            patientId: "12345",
            type: "Blood Pressure",
            value: "120/80",
            dateTime: new Date().toISOString(),
          },
          params: { patientId: "12345" }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        Test.create.mockResolvedValue(req.body);
    
        await addTestForPatient(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);   
        expect(res.json).toHaveBeenCalledWith(req.body);
      });
      
  
    it("should retrieve tests for a patient", async () => {
      const tests = [
        { type: "Blood Pressure", value: "120/80" },
        { type: "Respiratory Rate", value: "20" },
      ];
      
      Test.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(tests),
      });
      
  
      const req = { params: { id: "12345" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await getTestsForPatient(req, res);
  
      expect(res.json).toHaveBeenCalledWith(tests);
    });
  
    it("should retrieve a patient's history", async () => {
      const patient = { name: "Jane Doe", age: 40 };
      const tests = [{ type: "Blood Pressure", value: "120/80" }];
      Patient.findById.mockResolvedValue({ name: "Jane Doe", age: 40 });
      Test.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ type: "Blood Pressure", value: "120/80" }]),
      });
  
      const req = { params: { id: "12345" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await getPatientHistory(req, res);
  
      expect(res.json).toHaveBeenCalledWith({
        patient: { name: "Jane Doe", age: 40 },
        tests: [{ type: "Blood Pressure", value: "120/80" }],
      });
    });
  
    it("should retrieve patients in critical condition", async () => {
      const criticalPatients = [{ name: "John Doe", criticalCondition: true }];
      Patient.find.mockResolvedValue(criticalPatients);
  
      const req = {};
      const res = { json: jest.fn() };
  
      await getCriticalPatients(req, res);
  
      expect(res.json).toHaveBeenCalledWith(criticalPatients);
    });
  });
  