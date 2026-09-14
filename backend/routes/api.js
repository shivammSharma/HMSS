const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hmsController = require('../controllers/hmsController');
const { verifyToken } = require('../middleware/auth');

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, authController.getUsers);

// Dashboard
router.get('/dashboard/stats', verifyToken, hmsController.getDashboardStats);

// Doctors & Staff
router.get('/doctors', verifyToken, hmsController.getDoctors);
router.post('/doctors', verifyToken, hmsController.createDoctor);

// Patients
router.get('/patients', verifyToken, hmsController.getPatients);
router.post('/patients', verifyToken, hmsController.createPatient);

// OPD & IPD Consultations
router.get('/opd', verifyToken, hmsController.getOpd);
router.post('/opd', verifyToken, hmsController.createOpd);
router.get('/ipd', verifyToken, hmsController.getIpd);
router.post('/ipd', verifyToken, hmsController.createIpd);

// Appointments
router.get('/appointments', verifyToken, hmsController.getAppointments);
router.post('/appointments', verifyToken, hmsController.createAppointment);
router.patch('/appointments/:id/status', verifyToken, hmsController.updateAppointmentStatus);

// Beds
router.get('/beds', verifyToken, hmsController.getBeds);
router.post('/beds', verifyToken, hmsController.createBed);
router.post('/beds/assign', verifyToken, hmsController.assignBed);

// Prescriptions
router.get('/prescriptions', verifyToken, hmsController.getPrescriptions);
router.post('/prescriptions', verifyToken, hmsController.createPrescription);

// Medicines (Pharmacy)
router.get('/medicines', verifyToken, hmsController.getMedicines);
router.post('/medicines', verifyToken, hmsController.createMedicine);

// Labs (Pathology & Radiology)
router.get('/labs', verifyToken, hmsController.getLabs);
router.post('/pathology', verifyToken, hmsController.createPathologyTest);

// Blood Bank
router.get('/blood-bank', verifyToken, hmsController.getBloodBank);
router.post('/blood-donors', verifyToken, hmsController.createBloodDonor);

// Ambulances
router.get('/ambulances', verifyToken, hmsController.getAmbulances);
router.post('/ambulances', verifyToken, hmsController.createAmbulance);

// Birth & Death Reports
router.get('/reports', verifyToken, hmsController.getReports);
router.post('/reports/birth', verifyToken, hmsController.createBirthReport);

// Payroll
router.get('/payroll', verifyToken, hmsController.getPayroll);
router.post('/payroll', verifyToken, hmsController.createPayroll);

// Invoices & Billing
router.get('/invoices', verifyToken, hmsController.getInvoices);
router.post('/invoices', verifyToken, hmsController.createInvoice);

// Front Office & Reception
router.get('/reception-calls', verifyToken, hmsController.getReceptionCalls);
router.post('/reception-calls', verifyToken, hmsController.createReceptionCall);

// Notice Board
router.get('/notices', verifyToken, hmsController.getNotices);
router.post('/notices', verifyToken, hmsController.createNotice);
router.delete('/notices/:id', verifyToken, hmsController.deleteNotice);

module.exports = router;
