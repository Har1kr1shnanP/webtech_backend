const mockPatientModel = {
    find: jest.fn().mockResolvedValue([]), // Mocks find method to return an empty array by default
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockResolvedValue({ name: "Mock Patient", age: 50, criticalCondition: false }),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
  };
  
  export default mockPatientModel;
  