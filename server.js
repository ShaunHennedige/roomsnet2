const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// In-memory storage for booking data (replace with a database in production)
let bookings = [];

// API Routes
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  // Store the booking data (replace with database storage in production)
  bookings.push(bookingData);
  console.log('Received booking data:', bookingData);
  res.json({ message: 'Booking data received successfully', id: bookings.length - 1 });
});

app.get('/api/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < bookings.length) {
    res.json(bookings[id]);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});