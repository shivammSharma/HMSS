const mongoose = require('mongoose');

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient', 'pharmacist', 'receptionist', 'nurse', 'labtechnician', 'accountant'], default: 'patient' },
  phone: { type: String, default: '' },
  gender: { type: String, default: 'Other' },
  avatar: { type: String, default: '' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

// 2. Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, default: 'MD / MBBS' },
  fee: { type: Number, required: true, default: 500 },
  phone: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  availableDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
}, { timestamps: true });

// 3. Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, default: 'O+' },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, default: '' },
  condition: { type: String, default: 'Stable' }
}, { timestamps: true });

// 4. Patient Admission Schema
const patientAdmissionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  admissionDate: { type: String, required: true },
  dischargeDate: { type: String, default: '' },
  status: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
  packageFee: { type: Number, default: 5000 }
}, { timestamps: true });

// 5. OPD Patient Department Schema
const opdSchema = new mongoose.Schema({
  opdNumber: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  caseId: { type: String, default: 'CASE-101' },
  opdCharge: { type: Number, default: 600 },
  paymentMode: { type: String, default: 'Cash' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// 6. IPD Patient Department Schema
const ipdSchema = new mongoose.Schema({
  ipdNumber: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  admissionDate: { type: String, required: true },
  dischargeDate: { type: String, default: '' },
  height: { type: String, default: '175 cm' },
  weight: { type: String, default: '70 kg' },
  bp: { type: String, default: '120/80' },
  symptoms: { type: String, default: 'Fever and fatigue' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// 7. Appointment Schema
const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: { type: String, default: 'General' },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  problem: { type: String, default: 'General Checkup' },
  fee: { type: Number, default: 500 }
}, { timestamps: true });

// 8. Bed Schema
const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },
  bedType: { type: String, enum: ['ICU', 'VIP', 'General', 'Pediatric'], default: 'General' },
  charge: { type: Number, required: true, default: 1000 },
  isAvailable: { type: Boolean, default: true },
  assignedPatient: { type: String, default: '' },
  assignedDate: { type: String, default: '' }
}, { timestamps: true });

// 9. Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    days: Number
  }],
  advice: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// 10. Medicine Schema
const medicineSchema = new mongoose.Schema({
  medicineId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  brand: { type: String, default: 'Pharma' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: String, required: true }
}, { timestamps: true });

// 11. Pathology Test Schema
const pathologyTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  shortName: { type: String, required: true },
  testType: { type: String, default: 'Blood Test' },
  categoryName: { type: String, default: 'Hematology' },
  charge: { type: Number, required: true, default: 1200 }
}, { timestamps: true });

// 12. Radiology Test Schema
const radiologyTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  shortName: { type: String, required: true },
  testType: { type: String, default: 'X-Ray' },
  categoryName: { type: String, default: 'Diagnostic Imaging' },
  charge: { type: Number, required: true, default: 2500 }
}, { timestamps: true });

// 13. Blood Bank & Donor Schema
const bloodBankSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, unique: true },
  remBags: { type: Number, required: true, default: 10 }
}, { timestamps: true });

const bloodDonorSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  lastDonationDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// 14. Ambulance Schema
const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleModel: { type: String, required: true },
  driverName: { type: String, required: true },
  driverContact: { type: String, required: true },
  vehicleType: { type: String, default: 'Basic Life Support' },
  status: { type: String, enum: ['Available', 'On Duty'], default: 'Available' }
}, { timestamps: true });

// 15. Birth & Death Reports
const birthReportSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  childName: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: String, default: '3.2 kg' },
  date: { type: String, required: true },
  motherName: { type: String, required: true },
  doctorName: { type: String, required: true }
}, { timestamps: true });

const deathReportSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  causeOfDeath: { type: String, required: true }
}, { timestamps: true });

// 16. Employee Payroll Schema
const employeePayrollSchema = new mongoose.Schema({
  payrollId: { type: String, required: true },
  staffName: { type: String, required: true },
  role: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true, default: 2026 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' }
}, { timestamps: true });

// 17. Invoice & Financial Schemas
const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, default: 'HMS Staff' },
  items: [{
    description: String,
    amount: Number
  }],
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// 18. Front Office Schemas
const receptionCallSchema = new mongoose.Schema({
  callType: { type: String, enum: ['Incoming', 'Outgoing'], default: 'Incoming' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

const noticeBoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetRole: { type: String, default: 'All Staff' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// Models Export
const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const PatientAdmission = mongoose.model('PatientAdmission', patientAdmissionSchema);
const OpdDepartment = mongoose.model('OpdDepartment', opdSchema);
const IpdDepartment = mongoose.model('IpdDepartment', ipdSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Bed = mongoose.model('Bed', bedSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);
const PathologyTest = mongoose.model('PathologyTest', pathologyTestSchema);
const RadiologyTest = mongoose.model('RadiologyTest', radiologyTestSchema);
const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
const BloodDonor = mongoose.model('BloodDonor', bloodDonorSchema);
const Ambulance = mongoose.model('Ambulance', ambulanceSchema);
const BirthReport = mongoose.model('BirthReport', birthReportSchema);
const DeathReport = mongoose.model('DeathReport', deathReportSchema);
const EmployeePayroll = mongoose.model('EmployeePayroll', employeePayrollSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const ReceptionCall = mongoose.model('ReceptionCall', receptionCallSchema);
const NoticeBoard = mongoose.model('NoticeBoard', noticeBoardSchema);

module.exports = {
  User,
  Doctor,
  Patient,
  PatientAdmission,
  OpdDepartment,
  IpdDepartment,
  Appointment,
  Bed,
  Prescription,
  Medicine,
  PathologyTest,
  RadiologyTest,
  BloodBank,
  BloodDonor,
  Ambulance,
  BirthReport,
  DeathReport,
  EmployeePayroll,
  Invoice,
  ReceptionCall,
  NoticeBoard
};
