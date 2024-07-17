import React, { useEffect, useState } from 'react';
import { sendBookingData, getBookingData } from '../api/bookings';

const PaymentGateway = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async (bookingData) => {
      try {
        const result = await sendBookingData(bookingData);
        console.log('Booking data sent successfully:', result);
        setPaymentStatus('Payment successful and booking data sent.');
        
        // Retrieve the booking data to confirm it was stored correctly
        const retrievedBooking = await getBookingData(result.id);
        setBookingDetails(retrievedBooking);
      } catch (error) {
        console.error('Failed to send or retrieve booking data:', error);
        setPaymentStatus('Payment successful but failed to process booking data.');
      }
    };

    const handleMessage = (event) => {
      if (event.data.type === 'payment_success') {
        handlePaymentSuccess(event.data.bookingData);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <iframe 
        src="/paymentgateway.html" 
        style={{width: '100%', height: '800px', border: 'none'}}
        title="Payment Gateway"
      />
      {paymentStatus && <p>{paymentStatus}</p>}
      {bookingDetails && (
        <div>
          <h3>Booking Details:</h3>
          <pre>{JSON.stringify(bookingDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;