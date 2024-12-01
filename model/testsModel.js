import mongoose from "mongoose";

// Define the schema for a medical test
const testSchema = new mongoose.Schema({
  // Reference to the Patient model, linking each test to a specific patient
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  
  //  defaults current date and time
  date: { type: Date, required: true, default: Date.now },
  
  // Type of the medical test
  type: { 
    type: String, 
    required: true,
    enum: ['Blood Pressure', 'Respiratory Rate', 'Blood Oxygen Level', 'Heartbeat Rate']
  },
  
  // The result or value of the test
  value: { type: String, required: true }
});

// Export the Test model based on the schema
export default mongoose.model("Test", testSchema);