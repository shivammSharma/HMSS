const bcrypt = require('bcryptjs');

const initialUsers = [
  {
    name: 'Dr. Sarah Jenkins',
    email: 'admin@hms.com',
    password: '$2a$10$X87S14qJv5yZ2s.k56f4ueYh/r4eR9r0y.f1.2g5k8R911m331xW2',
    plainPassword: 'admin123',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    status: 'active'
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'doctor@hms.com',
    password: '$2a$10$X87S14qJv5yZ2s.k56f4ueYh/r4eR9r0y.f1.2g5k8R911m331xW2',
    plainPassword: 'admin123',
    role: 'doctor',
    phone: '+1 (555) 018-9921',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    status: 'active'
  },
  {
    name: 'John Doe',
    email: 'patient@hms.com',
    password: '$2a$10$X87S14qJv5yZ2s.k56f4ueYh/r4eR9r0y.f1.2g5k8R911m331xW2',
    plainPassword: 'admin123',
    role: 'patient',
    phone: '+1 (555) 014-4482',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    status: 'active'
  },
  {
    name: 'Elena Rostova',
    email: 'pharmacist@hms.com',
    password: '$2a$10$X87S14qJv5yZ2s.k56f4ueYh/r4eR9r0y.f1.2g5k8R911m331xW2',
    plainPassword: 'admin123',
    role: 'pharmacist',
    phone: '+1 (555) 012-7711',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    status: 'active'
  }
];

const initialDoctors = [
  { name: 'Dr. Marcus Vance', email: 'doctor@hms.com', department: 'Cardiology', specialization: 'Interventional Cardiologist', qualification: 'MD, FACC', fee: 800, phone: '+1 (555) 018-9921', status: 'Active', availableDays: ['Mon', 'Wed', 'Fri'] },
  { name: 'Dr. Emily Watson', email: 'emily.watson@hms.com', department: 'Neurology', specialization: 'Neuro-Oncology Specialist', qualification: 'MD, Ph.D.', fee: 950, phone: '+1 (555) 019-3320', status: 'Active', availableDays: ['Tue', 'Thu', 'Sat'] },
  { name: 'Dr. Robert Chen', email: 'robert.chen@hms.com', department: 'Pediatrics', specialization: 'Pediatric Care', qualification: 'MBBS, DCH', fee: 600, phone: '+1 (555) 017-8811', status: 'Active', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { name: 'Dr. Sophia Martinez', email: 'sophia.m@hms.com', department: 'Orthopedics', specialization: 'Joint Replacement', qualification: 'MS (Orthopedics)', fee: 750, phone: '+1 (555) 016-5544', status: 'Active', availableDays: ['Mon', 'Wed', 'Sat'] }
];

const initialPatients = [
  { name: 'John Doe', email: 'patient@hms.com', phone: '+1 (555) 014-4482', bloodGroup: 'O+', age: 34, gender: 'Male', address: '742 Evergreen Terrace', condition: 'Stable' },
  { name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+1 (555) 013-9988', bloodGroup: 'A+', age: 28, gender: 'Female', address: '12 Waiter Lane', condition: 'Under Observation' },
  { name: 'David Miller', email: 'david.m@example.com', phone: '+1 (555) 011-2233', bloodGroup: 'B-', age: 52, gender: 'Male', address: '88 Ocean Drive', condition: 'ICU Critical' }
];

const initialOpd = [
  { opdNumber: 'OPD-1001', patientName: 'John Doe', doctorName: 'Dr. Marcus Vance', appointmentDate: '2026-09-08', caseId: 'CASE-701', opdCharge: 800, paymentMode: 'Card', notes: 'Routine ECG checkup' },
  { opdNumber: 'OPD-1002', patientName: 'Alice Smith', doctorName: 'Dr. Emily Watson', appointmentDate: '2026-09-08', caseId: 'CASE-702', opdCharge: 950, paymentMode: 'Cash', notes: 'Migraine evaluation' }
];

const initialIpd = [
  { ipdNumber: 'IPD-5001', patientName: 'David Miller', doctorName: 'Dr. Marcus Vance', bedNumber: 'ICU-01', admissionDate: '2026-09-05', height: '178 cm', weight: '82 kg', bp: '135/90', symptoms: 'Chest tightness', notes: 'Post-angioplasty ICU monitoring' }
];

const initialAppointments = [
  { appointmentId: 'APT-1001', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Marcus Vance', department: 'Cardiology', date: '2026-09-08', timeSlot: '10:30 AM', status: 'Confirmed', problem: 'Routine Cardiac Checkup', fee: 800 },
  { appointmentId: 'APT-1002', patientId: 'p2', patientName: 'Alice Smith', doctorId: 'd2', doctorName: 'Dr. Emily Watson', department: 'Neurology', date: '2026-09-08', timeSlot: '02:00 PM', status: 'Pending', problem: 'Migraine and Dizziness', fee: 950 }
];

const initialBeds = [
  { bedNumber: 'ICU-01', bedType: 'ICU', charge: 3500, isAvailable: false, assignedPatient: 'David Miller', assignedDate: '2026-09-05' },
  { bedNumber: 'ICU-02', bedType: 'ICU', charge: 3500, isAvailable: true, assignedPatient: '', assignedDate: '' },
  { bedNumber: 'VIP-101', bedType: 'VIP', charge: 2200, isAvailable: false, assignedPatient: 'Alice Smith', assignedDate: '2026-09-06' },
  { bedNumber: 'GEN-201', bedType: 'General', charge: 800, isAvailable: true, assignedPatient: '', assignedDate: '' },
  { bedNumber: 'PED-301', bedType: 'Pediatric', charge: 1200, isAvailable: true, assignedPatient: '', assignedDate: '' }
];

const initialPrescriptions = [
  { prescriptionId: 'RX-701', patientName: 'John Doe', doctorName: 'Dr. Marcus Vance', diagnosis: 'Hypertension & Arrhythmia', medicines: [{ name: 'Atorvastatin 20mg', dosage: '1 Tablet', frequency: 'Once daily (Night)', days: 30 }], advice: 'Low sodium diet, daily walk.', date: '2026-09-05' }
];

const initialMedicines = [
  { medicineId: 'MED-101', name: 'Atorvastatin 20mg', category: 'Cardiovascular', brand: 'Lipitor', price: 45, quantity: 240, expiryDate: '2027-12-31' },
  { medicineId: 'MED-102', name: 'Amoxicillin 500mg', category: 'Antibiotic', brand: 'Amoxil', price: 18, quantity: 180, expiryDate: '2026-11-30' },
  { medicineId: 'MED-103', name: 'Paracetamol 650mg', category: 'Analgesic', brand: 'Dolo 650', price: 12, quantity: 500, expiryDate: '2028-05-15' },
  { medicineId: 'MED-105', name: 'Omeprazole 20mg', category: 'Gastrointestinal', brand: 'Prilosec', price: 30, quantity: 45, expiryDate: '2026-10-15' }
];

const initialPathology = [
  { testName: 'Complete Blood Count (CBC)', shortName: 'CBC Test', testType: 'Hematology', categoryName: 'Blood', charge: 1200 },
  { testName: 'Lipid Profile Panel', shortName: 'Lipid Panel', testType: 'Biochemistry', categoryName: 'Blood', charge: 1800 }
];

const initialRadiology = [
  { testName: 'Chest X-Ray Digital PA View', shortName: 'Chest X-Ray', testType: 'Digital X-Ray', categoryName: 'Radiology', charge: 1500 },
  { testName: 'Brain MRI Scan 3T', shortName: 'Brain MRI', testType: 'MRI', categoryName: 'Neurology Imaging', charge: 6500 }
];

const initialBloodBank = [
  { bloodGroup: 'A+', remBags: 14 },
  { bloodGroup: 'O+', remBags: 22 },
  { bloodGroup: 'B-', remBags: 6 },
  { bloodGroup: 'AB+', remBags: 9 }
];

const initialBloodDonors = [
  { donorName: 'Michael Brown', age: 29, gender: 'Male', bloodGroup: 'O+', phone: '+1 (555) 019-4400', lastDonationDate: '2026-08-15' }
];

const initialAmbulances = [
  { vehicleNumber: 'AMB-901', vehicleModel: 'Ford Transit ACLS', driverName: 'James Carter', driverContact: '+1 (555) 012-9900', vehicleType: 'Advanced Life Support', status: 'Available' },
  { vehicleNumber: 'AMB-902', vehicleModel: 'Mercedes Sprinter BLS', driverName: 'Samuel Green', driverContact: '+1 (555) 012-8811', vehicleType: 'Basic Life Support', status: 'On Duty' }
];

const initialBirthReports = [
  { caseId: 'CASE-301', childName: 'Baby Boy Doe', gender: 'Male', weight: '3.4 kg', date: '2026-09-01', motherName: 'Jane Doe', doctorName: 'Dr. Sophia Martinez' }
];

const initialDeathReports = [
  { caseId: 'CASE-099', patientName: 'William Harrison', doctorName: 'Dr. Marcus Vance', date: '2026-08-20', causeOfDeath: 'Multi-organ Failure' }
];

const initialPayroll = [
  { payrollId: 'PAY-101', staffName: 'Elena Rostova', role: 'Pharmacist', month: 'August', year: 2026, netSalary: 4500, status: 'Paid' },
  { payrollId: 'PAY-102', staffName: 'Nurse Nancy Taylor', role: 'Nurse', month: 'August', year: 2026, netSalary: 3800, status: 'Paid' }
];

const initialInvoices = [
  { invoiceId: 'INV-9001', patientName: 'John Doe', doctorName: 'Dr. Marcus Vance', items: [{ description: 'Cardiology OPD Consultation', amount: 800 }, { description: 'Lipid Profile Test', amount: 450 }], totalAmount: 1250, paidAmount: 1250, status: 'Paid', date: '2026-09-05' }
];

const initialReceptionCalls = [
  { callType: 'Incoming', name: 'Robert Vance', phone: '+1 (555) 019-3311', date: '2026-09-08', notes: 'Inquired about ICU visiting hours' }
];

const initialNotices = [
  { title: 'Annual Healthcare Accreditation Audit', description: 'Joint Commission hospital safety inspection scheduled for Sept 15.', targetRole: 'All Staff', date: '2026-09-07' }
];

class Store {
  constructor() {
    this.users = [...initialUsers];
    this.doctors = [...initialDoctors];
    this.patients = [...initialPatients];
    this.opd = [...initialOpd];
    this.ipd = [...initialIpd];
    this.appointments = [...initialAppointments];
    this.beds = [...initialBeds];
    this.prescriptions = [...initialPrescriptions];
    this.medicines = [...initialMedicines];
    this.pathology = [...initialPathology];
    this.radiology = [...initialRadiology];
    this.bloodBank = [...initialBloodBank];
    this.bloodDonors = [...initialBloodDonors];
    this.ambulances = [...initialAmbulances];
    this.birthReports = [...initialBirthReports];
    this.deathReports = [...initialDeathReports];
    this.payroll = [...initialPayroll];
    this.invoices = [...initialInvoices];
    this.receptionCalls = [...initialReceptionCalls];
    this.notices = [...initialNotices];
  }
}

const memoryStore = new Store();

const seedMongoDB = async (models) => {
  try {
    const userCount = await models.User.countDocuments();
    if (userCount === 0) {
      console.log('[Seeder] Populating database with all 16 MERN HMS hospital domain records...');
      const hashedUsers = await Promise.all(initialUsers.map(async (u) => {
        const password = await bcrypt.hash(u.plainPassword || 'admin123', 10);
        return { ...u, password };
      }));

      await models.User.insertMany(hashedUsers);
      await models.Doctor.insertMany(initialDoctors);
      await models.Patient.insertMany(initialPatients);
      await models.OpdDepartment.insertMany(initialOpd);
      await models.IpdDepartment.insertMany(initialIpd);
      await models.Appointment.insertMany(initialAppointments);
      await models.Bed.insertMany(initialBeds);
      await models.Prescription.insertMany(initialPrescriptions);
      await models.Medicine.insertMany(initialMedicines);
      await models.PathologyTest.insertMany(initialPathology);
      await models.RadiologyTest.insertMany(initialRadiology);
      await models.BloodBank.insertMany(initialBloodBank);
      await models.BloodDonor.insertMany(initialBloodDonors);
      await models.Ambulance.insertMany(initialAmbulances);
      await models.BirthReport.insertMany(initialBirthReports);
      await models.DeathReport.insertMany(initialDeathReports);
      await models.EmployeePayroll.insertMany(initialPayroll);
      await models.Invoice.insertMany(initialInvoices);
      await models.ReceptionCall.insertMany(initialReceptionCalls);
      await models.NoticeBoard.insertMany(initialNotices);

      console.log('[Seeder] Database successfully populated across all 16 hospital domains!');
    }
  } catch (err) {
    console.error('[Seeder Note]', err.message);
  }
};

module.exports = {
  memoryStore,
  seedMongoDB,
  initialUsers
};
