import Test from "../model/testsModel.js";
import Patient from "../model/patientModel.js";

// Add a new patient to the database
const addPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update the patient details
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;  
    const updatedData = req.body;  
    // Find the patient by ID and update their details
    const patient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    // Return the updated patient
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all patients from the database
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a specific patient by their ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params; // Get patient ID from the URL parameter

    // Find and delete the patient by ID
    const deletedPatient = await Patient.findByIdAndDelete(id);

    // If the patient is not found, return a 404 error
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return a success message or the deleted patient details
    res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add a new test for a specific patient
const addTestForPatient = async (req, res) => {
  try {
    const test = new Test({
      patientId: req.params.id,
      type: req.body.type,
      value: req.body.value
    });
    await test.save();

    // Update the patient's critical condition based on the new test
    await updatePatientCriticalCondition(req.params.id);

    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all tests for a specific patient
const getTestsForPatient = async (req, res) => {
  try {
    const tests = await Test.find({ patientId: req.params.id }).sort({ date: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a patient's complete history (personal info and all tests)
const getPatientHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const tests = await Test.find({ patientId: req.params.id }).sort({ date: -1 });

    const history = {
      patient: patient,
      tests: tests
    };

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all patients in critical condition
const getCriticalPatients = async (req, res) => {
  try {
    const criticalPatients = await Patient.find({ criticalCondition: true });
    res.json(criticalPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to update a patient's critical condition based on their latest test
const updatePatientCriticalCondition = async (patientId) => {
  const recentTests = await Test.find({ patientId: patientId }).sort({ date: -1 }).limit(1);
  
  if (recentTests.length > 0) {
    const latestTest = recentTests[0];
    let isCritical = false;

    // Determine if the patient is in critical condition based on the test type and value
    switch (latestTest.type) {
      case 'Blood Pressure':
        const [systolic, diastolic] = latestTest.value.split('/').map(Number);
        isCritical = systolic > 180 || systolic < 90 || diastolic > 120 || diastolic < 60;
        break;
      case 'Respiratory Rate':
        const rate = Number(latestTest.value);
        isCritical = rate > 30 || rate < 12;
        break;
      case 'Blood Oxygen Level':
        const oxygenLevel = Number(latestTest.value);
        isCritical = oxygenLevel < 90;
        break;
      case 'Heartbeat Rate':
        const heartRate = Number(latestTest.value);
        isCritical = heartRate > 100 || heartRate < 60;
        break;
    }

    // Update the patient's critical condition in the database
    await Patient.findByIdAndUpdate(patientId, { criticalCondition: isCritical });
  }
};

export { 
  addPatient, 
  updatePatient,
  getAllPatients, 
  getPatientById, 
  deletePatient,
  addTestForPatient, 
  getTestsForPatient, 
  getPatientHistory, 
  getCriticalPatients 
};