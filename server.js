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

// Serve static files from the "public" directory
app.use(express.static('public'));

// In-memory queue of patients
// Each entry has the shape: { name: string, procedure: string, duration: number }
const queue = [];

// Mapping of procedure names to their durations (in minutes).
// These values are based on typical durations for common dental procedures:
// - A simple tooth extraction typically takes 30 minutes 
// - A simple cavity filling may take as few as 20 minutes
const procedureTimes = {
  'خلع': 30,
  'حشو': 20,
  'تبييض': 45
};

/**
 * Helper to compute the total waiting time (in minutes) for all patients
 * currently in the queue.
 * @returns {number} Sum of durations of all queued patients.
 */
function calculateWaitingTime() {
  return queue.reduce((acc, patient) => acc + (patient.duration || 0), 0);
}

/**
 * POST /register
 * Registers a new patient. Expects a JSON body with:
 * {
 *   name: string,
 *   procedure: one of the keys in procedureTimes
 * }
 * Responds with the number of people ahead, the estimated waiting time in minutes,
 * and the position in the queue after registration.
 */
app.post('/register', (req, res) => {
  const { name, procedure } = req.body;
  // Validate input
  if (!name || !procedure) {
    return res.status(400).json({ error: 'Both name and procedure are required.' });
  }
  if (!procedureTimes.hasOwnProperty(procedure)) {
    return res.status(400).json({ error: 'Invalid procedure selected.' });
  }

  const duration = procedureTimes[procedure];
  const peopleAhead = queue.length;
  const waitingTime = calculateWaitingTime();

  // Add the new patient to the queue
  queue.push({ name, procedure, duration });

  // Respond with queue information
  res.json({
    position: peopleAhead + 1,
    peopleAhead,
    waitingTime,
    duration
  });
});

/**
 * GET /queue
 * Returns the current queue of patients
 */
app.get('/queue', (req, res) => {
  res.json(queue);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});