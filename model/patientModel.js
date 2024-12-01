import mongoose from "mongoose";

// Define the schema for a patient
const patientSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  medicalHistory: [{ type: String }],
  // Boolean value to check if the patient is in a critical condition
  criticalCondition: { type: Boolean, default: false }
});

// Export the Patient model based on the schema
export default mongoose.model("Patient", patientSchema);