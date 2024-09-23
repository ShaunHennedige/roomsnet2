// const express = require('express');
// const path = require('path');
// const bodyParser = require("body-parser");
// const cors = require('cors');
// const fs = require('fs');
// const axios = require('axios'); // Add axios to make requests to external APIs

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'build')));

// let bookings = []; // Initialize bookings as an empty array

// // API Routes
// app.get('/api/hello', (req, res) => {
//   res.send({ message: 'Hello from the server!' });
// });

// // Serve db.json as bookings data
// app.get('/api/bookings', (req, res) => {
//   const dbFilePath = path.join(__dirname, 'db.json');
//   fs.readFile(dbFilePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading db.json:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     try {
//       const jsonData = JSON.parse(data);
//       res.json(jsonData);
//     } catch (error) {
//       console.error('Error parsing db.json:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
// });

// // Handle individual booking by ID (if needed)
// app.get('/api/bookings/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   if (id >= 0 && id < bookings.length) {
//     res.json(bookings[id]);
//   } else {
//     res.status(404).json({ message: 'Booking not found' });
//   }
// });

// // Handle new booking submission and forward it to the external API
// app.post('/api/bookings', async (req, res) => {
//   const newBooking = req.body;

//   // Add new booking to the local array
//   bookings.push(newBooking);

//   // Save the booking locally to db.json (optional, you can skip this if not needed)
//   const dbFilePath = path.join(__dirname, 'db.json');
//   fs.writeFile(dbFilePath, JSON.stringify({ bookings }), (err) => {
//     if (err) {
//       console.error('Error writing to db.json:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   // Forward the booking to the external API
//   try {
//     const response = await axios.post('https://demo.citrusibe.com/API/PostBooking.aspx', newBooking, {
//       headers: {
//         'Content-Type': 'application/json',
//         'x-requested-with': 'XMLHttpRequest',  // Add other necessary headers here
//       },
//     });

//     // If the API request was successful, return the response to the frontend
//     res.status(201).json({ message: 'Booking added successfully', data: response.data });

//   } catch (error) {
//     // Handle any errors that occur during the API request
//     console.error('Error making API request:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Error forwarding booking to the external API' });
//   }
// });

// // Serve the React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Start the server on the specified port
// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });


const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');
const fs = require('fs');
const axios = require('axios'); // Add axios to make requests to external APIs

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve the React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Initialize bookings array
let bookings = [];

// API Routes
app.post('/api/bookings', async (req, res) => {
  const newBooking = req.body;

  // Add new booking to the local array
  bookings.push(newBooking);

  // Save the booking locally to db.json (optional)
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.writeFile(dbFilePath, JSON.stringify({ bookings }), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Forward the booking to the external API
  try {
    const response = await axios.post('https://demo.citrusibe.com/API/PostBooking.aspx', newBooking, {
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
      },
    });

    // If the API request was successful, return the response to the frontend
    res.status(201).json({ message: 'Booking added successfully', data: response.data });

  } catch (error) {
    // Handle any errors that occur during the API request
    console.error('Error making API request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error forwarding booking to the external API' });
  }
});

// Serve the React app in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
