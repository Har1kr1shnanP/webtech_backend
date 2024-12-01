import express from 'express';
import { 
  addPatient, 
  updatePatient,
  getAllPatients, 
  getPatientById, 
  deletePatient,
  addTestForPatient, 
  getTestsForPatient, 
  getPatientHistory, 
  getCriticalPatients 
} from '../controller/patientController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the patient
 *         name:
 *           type: string
 *           description: The patient's full name
 *         age:
 *           type: integer
 *           description: The patient's age
 *         gender:
 *           type: string
 *           description: The patient's gender
 *         address:
 *           type: string
 *           description: The patient's address
 *         contactNumber:
 *           type: string
 *           description: The patient's contact number
 *       required:
 *         - id
 *         - name
 *         - age
 *         - gender
 *     Test:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the test
 *         patientId:
 *           type: string
 *           description: The ID of the patient the test belongs to
 *         testType:
 *           type: string
 *           description: The type of test conducted
 *         testDate:
 *           type: string
 *           format: date
 *           description: The date the test was conducted
 *         result:
 *           type: string
 *           description: The result of the test
 *       required:
 *         - id
 *         - patientId
 *         - testType
 *         - testDate
 *         - result
 */

// Patient-related routes

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Add a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Successfully created a new patient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 */
router.post('/patients', addPatient);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Retrieve a list of all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 */
router.get('/patients', getAllPatients);
/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient details
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */
router.put('/patients/:id', updatePatient);

/**
 * @swagger
 * /api/patients/critical:
 *   get:
 *     summary: Get all patients in critical condition
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients in critical condition
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 */
router.get('/patients/critical', getCriticalPatients);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Retrieve a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to retrieve
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */
router.get('/patients/:id', getPatientById);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to delete
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 deletedPatient:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 */
router.delete('/patients/:id', deletePatient);

// Test-related routes

/**
 * @swagger
 * /api/patients/{id}/tests:
 *   post:
 *     summary: Add a new test for a patient
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to add a test for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       201:
 *         description: Successfully added a new test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Patient not found
 */
router.post('/patients/:id/tests', addTestForPatient);

/**
 * @swagger
 * /api/patients/{id}/tests:
 *   get:
 *     summary: Retrieve all tests for a patient
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to retrieve tests for
 *     responses:
 *       200:
 *         description: List of tests for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *       404:
 *         description: Patient not found
 */
router.get('/patients/:id/tests', getTestsForPatient);

/**
 * @swagger
 * /api/patients/{id}/history:
 *   get:
 *     summary: Get patient's history including all tests
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient to retrieve history for
 *     responses:
 *       200:
 *         description: Patient's history with all tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patient:
 *                   $ref: '#/components/schemas/Patient'
 *                 tests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Test'
 *       404:
 *         description: Patient not found
 */
router.get('/patients/:id/history', getPatientHistory);

export default router;
