const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For generating the hash
const path = require('path');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MERCHANT_ID = '1227698'; // Replace with your PayHere Merchant ID
const MERCHANT_SECRET = 'ODQxNDEyNDc2Mjk0NjMxMjcyNTM3NjY4Njc2NDY0MTU1NjMzMTE4'; // Replace with your actual Merchant Secret

// Function to generate hash for PayHere
const generateHash = (orderId, amount, currency) => {
  const localHash = crypto.createHash('md5')
    .update(`${MERCHANT_ID}${orderId}${amount}${currency}${crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex').toUpperCase()}`)
    .digest('hex')
    .toUpperCase();
  return localHash;
};

// POST endpoint to generate payment hash and handle reservation booking
app.post('/api/generate-hash', (req, res) => {
  console.log('Request received at /api/generate-hash with data:', req.body);

  const { order_id, amount, currency } = req.body;

  if (!order_id || !amount || !currency) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const hash = generateHash(order_id, amount, currency);
      console.log('Generated hash:', hash); // Log the generated hash
      res.json({ hash });
  } catch (error) {
      console.error('Error generating hash:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle PayHere payment notifications
app.post('/notify', (req, res) => {
    const {
        order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig,
    } = req.body;

    console.log('Received PayHere notification for order:', order_id);

    // Generate the local MD5 signature using the data received
    const localMd5Sig = crypto.createHash('md5').update(
        `${MERCHANT_ID}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex').toUpperCase()}`
    ).digest('hex').toUpperCase();

    if (localMd5Sig === md5sig) {
        if (status_code === '2') { // Status code 2 means successful payment
            console.log(`Payment successful for order: ${order_id}`);
            // TODO: Update your database as payment success
            res.sendStatus(200);
        } else {
            console.log(`Payment failed or pending for order: ${order_id}`);
            res.sendStatus(200);
        }
    } else {
        console.error('Invalid signature');
        res.status(400).send('Invalid signature');
    }
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 404 Handler for other routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
