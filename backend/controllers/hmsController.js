const {
  Doctor, Patient, PatientAdmission, OpdDepartment, IpdDepartment, Appointment,
  Bed, Prescription, Medicine, PathologyTest, RadiologyTest, BloodBank, BloodDonor,
  Ambulance, BirthReport, DeathReport, EmployeePayroll, Invoice, ReceptionCall, NoticeBoard
} = require('../models');
const { memoryStore } = require('../utils/seeder');
const { getIsConnected } = require('../config/db');

// --- DASHBOARD ANALYTICS ---
const getDashboardStats = async (req, res) => {
  try {
    let doctors, patients, appointments, beds, invoices, medicines, admissions, ambulances;

    if (getIsConnected()) {
      doctors = await Doctor.find();
      patients = await Patient.find();
      appointments = await Appointment.find();
      beds = await Bed.find();
      invoices = await Invoice.find();
      medicines = await Medicine.find();
      admissions = await PatientAdmission.find();
      ambulances = await Ambulance.find();
    } else {
      doctors = memoryStore.doctors || [];
      patients = memoryStore.patients || [];
      appointments = memoryStore.appointments || [];
      beds = memoryStore.beds || [];
      invoices = memoryStore.invoices || [];
      medicines = memoryStore.medicines || [];
      admissions = memoryStore.admissions || [];
      ambulances = memoryStore.ambulances || [];
    }

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const availableBeds = beds.filter(b => b.isAvailable).length;
    const occupiedBeds = beds.length - availableBeds;
    const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
    const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed').length;
    const lowStockMedicines = medicines.filter(m => m.quantity < 50).length;

    return res.json({
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalAdmissions: admissions.length,
      totalAmbulances: ambulances.length,
      pendingAppointments,
      confirmedAppointments,
      totalBeds: beds.length,
      availableBeds,
      occupiedBeds,
      totalRevenue,
      lowStockMedicines,
      recentAppointments: appointments.slice(-5).reverse(),
      recentInvoices: invoices.slice(-5).reverse()
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    return res.status(500).json({ message: 'Error loading dashboard statistics.' });
  }
};

// --- DOCTORS ---
const getDoctors = async (req, res) => {
  if (getIsConnected()) return res.json(await Doctor.find());
  return res.json(memoryStore.doctors || []);
};

const createDoctor = async (req, res) => {
  const { name, email, department, specialization, qualification, fee, phone } = req.body;
  const newDoc = {
    _id: 'doc_' + Date.now(),
    name, email, department,
    specialization: specialization || 'General Medicine',
    qualification: qualification || 'MD / MBBS',
    fee: Number(fee) || 500,
    phone: phone || '', status: 'Active',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  };

  if (getIsConnected()) {
    const { _id, ...data } = newDoc;
    return res.status(201).json(await Doctor.create(data));
  }
  memoryStore.doctors.push(newDoc);
  return res.status(201).json(newDoc);
};

// --- PATIENTS ---
const getPatients = async (req, res) => {
  if (getIsConnected()) return res.json(await Patient.find());
  return res.json(memoryStore.patients || []);
};

const createPatient = async (req, res) => {
  const { name, email, phone, bloodGroup, age, gender, address, condition } = req.body;
  const newPat = {
    _id: 'pat_' + Date.now(),
    name, email, phone, bloodGroup: bloodGroup || 'O+',
    age: Number(age) || 30, gender: gender || 'Male',
    address: address || '', condition: condition || 'Stable'
  };

  if (getIsConnected()) {
    const { _id, ...data } = newPat;
    return res.status(201).json(await Patient.create(data));
  }
  memoryStore.patients.push(newPat);
  return res.status(201).json(newPat);
};

// --- OPD / IPD DEPARTMENTS ---
const getOpd = async (req, res) => {
  if (getIsConnected()) return res.json(await OpdDepartment.find());
  return res.json(memoryStore.opd || []);
};

const createOpd = async (req, res) => {
  const { patientName, doctorName, opdCharge, paymentMode, notes } = req.body;
  const newOpd = {
    _id: 'opd_' + Date.now(),
    opdNumber: 'OPD-' + Math.floor(1000 + Math.random() * 9000),
    patientName, doctorName,
    appointmentDate: new Date().toISOString().split('T')[0],
    caseId: 'CASE-' + Math.floor(100 + Math.random() * 900),
    opdCharge: Number(opdCharge) || 600,
    paymentMode: paymentMode || 'Cash',
    notes: notes || 'OPD Checkup'
  };
  if (getIsConnected()) {
    const { _id, ...data } = newOpd;
    return res.status(201).json(await OpdDepartment.create(data));
  }
  memoryStore.opd.push(newOpd);
  return res.status(201).json(newOpd);
};

const getIpd = async (req, res) => {
  if (getIsConnected()) return res.json(await IpdDepartment.find());
  return res.json(memoryStore.ipd || []);
};

const createIpd = async (req, res) => {
  const { patientName, doctorName, bedNumber, height, weight, bp, symptoms } = req.body;
  const newIpd = {
    _id: 'ipd_' + Date.now(),
    ipdNumber: 'IPD-' + Math.floor(1000 + Math.random() * 9000),
    patientName, doctorName, bedNumber,
    admissionDate: new Date().toISOString().split('T')[0],
    height: height || '175 cm', weight: weight || '70 kg',
    bp: bp || '120/80', symptoms: symptoms || 'Severe Pain', notes: 'Under observation'
  };
  if (getIsConnected()) {
    const { _id, ...data } = newIpd;
    return res.status(201).json(await IpdDepartment.create(data));
  }
  memoryStore.ipd.push(newIpd);
  return res.status(201).json(newIpd);
};

// --- APPOINTMENTS ---
const getAppointments = async (req, res) => {
  if (getIsConnected()) return res.json(await Appointment.find());
  return res.json(memoryStore.appointments || []);
};

const createAppointment = async (req, res) => {
  const { patientName, doctorName, department, date, timeSlot, problem, fee } = req.body;
  const newApt = {
    _id: 'apt_' + Date.now(),
    appointmentId: 'APT-' + Math.floor(1000 + Math.random() * 9000),
    patientId: 'pat_custom', patientName: patientName || 'Patient',
    doctorId: 'doc_custom', doctorName: doctorName || 'Dr. Specialist',
    department: department || 'General', date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '10:00 AM', status: 'Pending', problem: problem || 'General Checkup',
    fee: Number(fee) || 500
  };

  if (getIsConnected()) {
    const { _id, ...data } = newApt;
    return res.status(201).json(await Appointment.create(data));
  }
  memoryStore.appointments.push(newApt);
  return res.status(201).json(newApt);
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (getIsConnected()) return res.json(await Appointment.findByIdAndUpdate(id, { status }, { new: true }));
  const apt = memoryStore.appointments.find(a => a._id === id);
  if (apt) { apt.status = status; return res.json(apt); }
  return res.status(404).json({ message: 'Appointment not found.' });
};

// --- BEDS ---
const getBeds = async (req, res) => {
  if (getIsConnected()) return res.json(await Bed.find());
  return res.json(memoryStore.beds || []);
};

const assignBed = async (req, res) => {
  const { bedId, patientName } = req.body;
  if (getIsConnected()) {
    const bed = await Bed.findById(bedId);
    if (!bed) return res.status(404).json({ message: 'Bed not found' });
    bed.isAvailable = !patientName;
    bed.assignedPatient = patientName || '';
    bed.assignedDate = patientName ? new Date().toISOString().split('T')[0] : '';
    await bed.save();
    return res.json(bed);
  }
  const bed = memoryStore.beds.find(b => b._id === bedId);
  if (bed) {
    bed.isAvailable = !patientName;
    bed.assignedPatient = patientName || '';
    bed.assignedDate = patientName ? new Date().toISOString().split('T')[0] : '';
    return res.json(bed);
  }
  return res.status(404).json({ message: 'Bed not found' });
};

const createBed = async (req, res) => {
  const { bedNumber, bedType, charge } = req.body;
  const newBed = {
    _id: 'b_' + Date.now(), bedNumber, bedType: bedType || 'General',
    charge: Number(charge) || 1000, isAvailable: true, assignedPatient: '', assignedDate: ''
  };
  if (getIsConnected()) {
    const { _id, ...data } = newBed;
    return res.status(201).json(await Bed.create(data));
  }
  memoryStore.beds.push(newBed);
  return res.status(201).json(newBed);
};

// --- PRESCRIPTIONS ---
const getPrescriptions = async (req, res) => {
  if (getIsConnected()) return res.json(await Prescription.find());
  return res.json(memoryStore.prescriptions || []);
};

const createPrescription = async (req, res) => {
  const { patientName, doctorName, diagnosis, medicines, advice } = req.body;
  const newRx = {
    _id: 'rx_' + Date.now(),
    prescriptionId: 'RX-' + Math.floor(100 + Math.random() * 900),
    patientName, doctorName, diagnosis,
    medicines: medicines || [], advice: advice || '',
    date: new Date().toISOString().split('T')[0]
  };
  if (getIsConnected()) {
    const { _id, ...data } = newRx;
    return res.status(201).json(await Prescription.create(data));
  }
  memoryStore.prescriptions.push(newRx);
  return res.status(201).json(newRx);
};

// --- MEDICINES & PHARMACY ---
const getMedicines = async (req, res) => {
  if (getIsConnected()) return res.json(await Medicine.find());
  return res.json(memoryStore.medicines || []);
};

const createMedicine = async (req, res) => {
  const { name, category, brand, price, quantity, expiryDate } = req.body;
  const newMed = {
    _id: 'm_' + Date.now(),
    medicineId: 'MED-' + Math.floor(100 + Math.random() * 900),
    name, category: category || 'General', brand: brand || 'Generic',
    price: Number(price) || 20, quantity: Number(quantity) || 100,
    expiryDate: expiryDate || '2027-12-31'
  };
  if (getIsConnected()) {
    const { _id, ...data } = newMed;
    return res.status(201).json(await Medicine.create(data));
  }
  memoryStore.medicines.push(newMed);
  return res.status(201).json(newMed);
};

// --- PATHOLOGY & RADIOLOGY LABS ---
const getLabs = async (req, res) => {
  if (getIsConnected()) {
    const path = await PathologyTest.find();
    const rad = await RadiologyTest.find();
    return res.json({ pathology: path, radiology: rad });
  }
  return res.json({ pathology: memoryStore.pathology || [], radiology: memoryStore.radiology || [] });
};

const createPathologyTest = async (req, res) => {
  const { testName, shortName, testType, charge } = req.body;
  const newTest = { _id: 'path_' + Date.now(), testName, shortName, testType: testType || 'Blood', charge: Number(charge) || 1200 };
  if (getIsConnected()) {
    const { _id, ...data } = newTest;
    return res.status(201).json(await PathologyTest.create(data));
  }
  memoryStore.pathology.push(newTest);
  return res.status(201).json(newTest);
};

// --- BLOOD BANK ---
const getBloodBank = async (req, res) => {
  if (getIsConnected()) {
    const bank = await BloodBank.find();
    const donors = await BloodDonor.find();
    return res.json({ bank, donors });
  }
  return res.json({ bank: memoryStore.bloodBank || [], donors: memoryStore.bloodDonors || [] });
};

const createBloodDonor = async (req, res) => {
  const { donorName, age, gender, bloodGroup, phone } = req.body;
  const newDonor = {
    _id: 'donor_' + Date.now(), donorName, age: Number(age) || 25,
    gender: gender || 'Male', bloodGroup: bloodGroup || 'O+', phone,
    lastDonationDate: new Date().toISOString().split('T')[0]
  };
  if (getIsConnected()) {
    const { _id, ...data } = newDonor;
    return res.status(201).json(await BloodDonor.create(data));
  }
  memoryStore.bloodDonors.push(newDonor);
  return res.status(201).json(newDonor);
};

// --- AMBULANCE SERVICE ---
const getAmbulances = async (req, res) => {
  if (getIsConnected()) return res.json(await Ambulance.find());
  return res.json(memoryStore.ambulances || []);
};

const createAmbulance = async (req, res) => {
  const { vehicleNumber, vehicleModel, driverName, driverContact, vehicleType } = req.body;
  const newAmb = {
    _id: 'amb_' + Date.now(), vehicleNumber, vehicleModel, driverName, driverContact,
    vehicleType: vehicleType || 'BLS Support', status: 'Available'
  };
  if (getIsConnected()) {
    const { _id, ...data } = newAmb;
    return res.status(201).json(await Ambulance.create(data));
  }
  memoryStore.ambulances.push(newAmb);
  return res.status(201).json(newAmb);
};

// --- BIRTH & DEATH REPORTS ---
const getReports = async (req, res) => {
  if (getIsConnected()) {
    const birth = await BirthReport.find();
    const death = await DeathReport.find();
    return res.json({ birth, death });
  }
  return res.json({ birth: memoryStore.birthReports || [], death: memoryStore.deathReports || [] });
};

const createBirthReport = async (req, res) => {
  const { childName, gender, weight, motherName, doctorName } = req.body;
  const newBirth = {
    _id: 'birth_' + Date.now(), caseId: 'CASE-' + Math.floor(100 + Math.random() * 900),
    childName, gender, weight: weight || '3.2 kg', date: new Date().toISOString().split('T')[0],
    motherName, doctorName
  };
  if (getIsConnected()) {
    const { _id, ...data } = newBirth;
    return res.status(201).json(await BirthReport.create(data));
  }
  memoryStore.birthReports.push(newBirth);
  return res.status(201).json(newBirth);
};

// --- PAYROLL ---
const getPayroll = async (req, res) => {
  if (getIsConnected()) return res.json(await EmployeePayroll.find());
  return res.json(memoryStore.payroll || []);
};

const createPayroll = async (req, res) => {
  const { staffName, role, month, year, netSalary, status } = req.body;
  const newPay = {
    _id: 'pay_' + Date.now(),
    payrollId: 'PAY-' + Math.floor(100 + Math.random() * 900),
    staffName, role, month: month || 'September',
    year: Number(year) || new Date().getFullYear(),
    netSalary: Number(netSalary) || 0,
    status: status || 'Unpaid'
  };
  if (getIsConnected()) {
    const { _id, ...data } = newPay;
    return res.status(201).json(await EmployeePayroll.create(data));
  }
  memoryStore.payroll.push(newPay);
  return res.status(201).json(newPay);
};

// --- INVOICES ---
const getInvoices = async (req, res) => {
  if (getIsConnected()) return res.json(await Invoice.find());
  return res.json(memoryStore.invoices || []);
};

const createInvoice = async (req, res) => {
  const { patientName, doctorName, items, totalAmount, paidAmount, status } = req.body;
  const newInv = {
    _id: 'inv_' + Date.now(),
    invoiceId: 'INV-' + Math.floor(9000 + Math.random() * 900),
    patientName, doctorName: doctorName || 'HMS Staff', items: items || [],
    totalAmount: Number(totalAmount) || 0, paidAmount: Number(paidAmount) || 0,
    status: status || (paidAmount >= totalAmount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid'),
    date: new Date().toISOString().split('T')[0]
  };
  if (getIsConnected()) {
    const { _id, ...data } = newInv;
    return res.status(201).json(await Invoice.create(data));
  }
  memoryStore.invoices.push(newInv);
  return res.status(201).json(newInv);
};

// --- RECEPTION CALLS ---
const getReceptionCalls = async (req, res) => {
  if (getIsConnected()) return res.json(await ReceptionCall.find());
  return res.json(memoryStore.receptionCalls || []);
};

const createReceptionCall = async (req, res) => {
  const { callType, name, phone, notes } = req.body;
  const newCall = {
    _id: 'call_' + Date.now(),
    callType: callType || 'Incoming',
    name, phone,
    date: new Date().toISOString().split('T')[0],
    notes: notes || ''
  };
  if (getIsConnected()) {
    const { _id, ...data } = newCall;
    return res.status(201).json(await ReceptionCall.create(data));
  }
  memoryStore.receptionCalls.push(newCall);
  return res.status(201).json(newCall);
};

// --- NOTICES ---
const getNotices = async (req, res) => {
  if (getIsConnected()) return res.json(await NoticeBoard.find());
  return res.json(memoryStore.notices || []);
};

const createNotice = async (req, res) => {
  const { title, description, targetRole } = req.body;
  const newNotice = {
    _id: 'notice_' + Date.now(),
    title, description,
    targetRole: targetRole || 'All Staff',
    date: new Date().toISOString().split('T')[0]
  };
  if (getIsConnected()) {
    const { _id, ...data } = newNotice;
    return res.status(201).json(await NoticeBoard.create(data));
  }
  memoryStore.notices.push(newNotice);
  return res.status(201).json(newNotice);
};

const deleteNotice = async (req, res) => {
  const { id } = req.params;
  if (getIsConnected()) {
    await NoticeBoard.findByIdAndDelete(id);
    return res.json({ message: 'Notice deleted.' });
  }
  const idx = memoryStore.notices.findIndex(n => n._id === id);
  if (idx !== -1) memoryStore.notices.splice(idx, 1);
  return res.json({ message: 'Notice deleted.' });
};

module.exports = {
  getDashboardStats,
  getDoctors, createDoctor,
  getPatients, createPatient,
  getOpd, createOpd,
  getIpd, createIpd,
  getAppointments, createAppointment, updateAppointmentStatus,
  getBeds, assignBed, createBed,
  getPrescriptions, createPrescription,
  getMedicines, createMedicine,
  getLabs, createPathologyTest,
  getBloodBank, createBloodDonor,
  getAmbulances, createAmbulance,
  getReports, createBirthReport,
  getPayroll, createPayroll,
  getInvoices, createInvoice,
  getReceptionCalls, createReceptionCall,
  getNotices, createNotice, deleteNotice
};
