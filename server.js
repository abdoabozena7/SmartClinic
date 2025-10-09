const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static frontend files
app.use(express.static('public'));

// Redirect root path to login page to make it easier for users who visit '/' directly.
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

/*
 * In-memory data stores
 * Note: In a production system you would use a database and proper authentication.
 */

// Users: two default accounts for demonstration
const users = [
  { id: 1, email: 'admin@example.com', password: '123', role: 'admin' },
  { id: 2, email: 'patient@example.com', password: '123', role: 'patient' }
];

// Doctors store
// Each doctor has: id, name, services (array of strings), schedule (object keyed by date => array of time slot objects)
const doctors = [];

// Appointments log (for reporting)
const appointments = [];

// Helper to generate unique IDs (simple counter)
let nextDoctorId = 1;

/*
 * Authentication route
 * POST /api/login
 * Expects { email, password } and returns the user object without password on success.
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials.' });
  }
  // Return user info without password
  const { id, role } = user;
  res.json({ id, email, role });
});

/*
 * Admin route to add a new doctor
 * POST /api/doctors
 * Body: { name: string, services: array of strings }
 */
app.post('/api/doctors', (req, res) => {
  const { name, services } = req.body;
  if (!name || !Array.isArray(services)) {
    return res.status(400).json({ error: 'Name and services are required.' });
  }
  const doctor = {
    id: nextDoctorId++,
    name,
    services,
    schedule: {}
  };
  doctors.push(doctor);
  res.json(doctor);
});

/*
 * Admin route to add timeslots for a doctor
 * POST /api/doctors/:id/timeslots
 * Body: { date: 'YYYY-MM-DD', times: array of strings, service: string }
 * Adds time slots on the given date for the specified service.
 */
app.post('/api/doctors/:id/timeslots', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }
  const { date, times, service } = req.body;
  if (!date || !Array.isArray(times) || !service) {
    return res.status(400).json({ error: 'Date, times, and service are required.' });
  }
  if (!doctor.services.includes(service)) {
    return res.status(400).json({ error: 'Service is not registered for this doctor.' });
  }
  // Initialize schedule for date if not present
  if (!doctor.schedule[date]) {
    doctor.schedule[date] = [];
  }
  times.forEach(time => {
    // Ensure time slot does not already exist
    if (!doctor.schedule[date].some(slot => slot.time === time)) {
      doctor.schedule[date].push({ time, service, booked: false, patientEmail: null });
    }
  });
  res.json({ message: 'Timeslots added successfully.', schedule: doctor.schedule[date] });
});

/*
 * GET /api/doctors
 * Returns list of all doctors with their id, name, and services (excluding schedule to avoid exposing personal bookings)
 */
app.get('/api/doctors', (req, res) => {
  const list = doctors.map(d => ({ id: d.id, name: d.name, services: d.services }));
  res.json(list);
});

/*
 * GET /api/doctors/:id/available
 * Query param: date (YYYY-MM-DD)
 * Returns available time slots (not booked) for the specified doctor and date.
 */
app.get('/api/doctors/:id/available', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Please specify a date.' });
  }
  const slots = (doctor.schedule[date] || []).filter(slot => !slot.booked);
  res.json(slots);
});

/*
 * POST /api/bookings
 * Body: { doctorId: number, date: 'YYYY-MM-DD', time: 'HH:MM', patientEmail: string }
 * Books an appointment if the time slot is available.
 */
app.post('/api/bookings', (req, res) => {
  const { doctorId, date, time, patientEmail } = req.body;
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }
  if (!doctor.schedule[date]) {
    return res.status(400).json({ error: 'No available times on this date.' });
  }
  const slot = doctor.schedule[date].find(s => s.time === time);
  if (!slot) {
    return res.status(404).json({ error: 'This timeslot does not exist.' });
  }
  if (slot.booked) {
    return res.status(400).json({ error: 'This timeslot is already booked.' });
  }
  // Mark slot as booked
  slot.booked = true;
  slot.patientEmail = patientEmail;
  // Log appointment
  appointments.push({ doctorId: doctor.id, doctorName: doctor.name, date, time, service: slot.service, patientEmail });
  res.json({ message: 'Appointment booked successfully.' });
});

/*
 * GET /api/appointments (Admin only)
 * Returns a list of all booked appointments.
 */
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// Catch-all handler for 404 on unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Path not found.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Appointment server running on http://localhost:${PORT}`);
});