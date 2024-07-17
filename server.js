const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Dummy data for bookings (replace with your actual data)
let bookings = [];

// API Routes

// GET route for testing
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the server!' });
});

// GET route to serve db.json as bookings data
app.get('/api/bookings', (req, res) => {
  res.sendFile(path.join(__dirname, 'db.json'));
});

// POST route to handle booking submissions
app.post('/api/bookings', (req, res) => {
  const bookingData = req.body; // Assuming req.body contains the new booking data

  // Read existing bookings from db.json
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Failed to read database' });
    }

    let bookings = JSON.parse(data); // Parse existing data as JSON array
    bookings.push(bookingData); // Add new booking to the array

    // Write updated data back to db.json
    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        console.error('Error writing db.json:', err);
        return res.status(500).json({ error: 'Failed to update database' });
      }

      // Respond with success message or updated data
      res.json({ message: 'Booking added successfully', booking: bookingData });
    });
  });
});


// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
