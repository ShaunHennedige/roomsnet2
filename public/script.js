document.getElementById('checkout-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const customer = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('billing-address').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    };

    // Generate dynamic order ID
    const order_id = 'ORDER_' + Math.floor(Math.random() * 1000000).toString();

    // Retrieve amount and currency from the active reservation
    const reservations = JSON.parse(localStorage.getItem('activeReservations')) || [];
    const amount = reservations.length > 0 ? reservations[0].amount : '0.00';
    const currency = reservations.length > 0 ? reservations[0].currency : 'USD';

    console.log("Sending request to generate payment hash...");

    // Step 1: Generate hash from the backend
    fetch('http://localhost:3001/api/generate-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, amount, currency })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); // Parse JSON if the response was OK
    })
    .then(data => {
        if (data.hash) {
            console.log('Hash generated:', data.hash);

            // Step 2: Prepare payment details
            const payment = {
                sandbox: true, 
                merchant_id: '1227698', 
                return_url: 'success.html', 
                cancel_url: 'cancel.html', 
                notify_url: 'http://localhost:3001/notify', 
                order_id: order_id, 
                items: 'Room Booking', 
                amount: amount, 
                currency: currency, 
                hash: data.hash, 
                first_name: customer.first_name, 
                last_name: customer.last_name, 
                email: customer.email, 
                phone: customer.phone, 
                address: customer.address, 
                city: customer.city, 
                country: customer.country
            };

            // Step 3: Start payment
            payhere.startPayment(payment);
        } else {
            alert('Error generating payment hash.');
        }
    })
    .catch(error => {
        console.error('Error while generating payment hash:', error);
        alert('Failed to generate payment hash. Please try again.');
    });
});
