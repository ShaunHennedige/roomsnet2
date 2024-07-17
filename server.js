const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

let bookings = []; // Initialize bookings as an empty array

// API Routes
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

// Serve db.json as bookings data
app.get('/api/bookings', (req, res) => {
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      console.error('Error parsing db.json:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
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

// Handle new booking submission
app.post('/api/bookings', (req, res) => {
  const newBooking = req.body;
  bookings.push(newBooking); // Add new booking to the array
  
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.writeFile(dbFilePath, JSON.stringify({ bookings }), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(201).json({ message: 'Booking added successfully' });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
