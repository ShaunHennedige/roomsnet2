const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Dummy data for bookings (replace with your actual data)
let bookings = [];

// API Routes
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

// Serve db.json as bookings data
app.get('/api/bookings', (req, res) => {
  res.sendFile(path.join(__dirname, 'db.json'));
});

// Handle individual booking by ID (if needed)
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
