const mockTestModel = {
    find: jest.fn().mockResolvedValue([]), // Mocks find method to return an empty array by default
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockResolvedValue({ type: "Blood Pressure", value: "120/80", patientId: "12345" }),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
  };
  
  export default mockTestModel;
  