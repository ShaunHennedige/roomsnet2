import axios from 'axios';

export const sendBookingData = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error sending booking data:', error);
    throw error;
  }
};

export const getBookingData = async (id) => {
  try {
    const response = await axios.get(`/api/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving booking data:', error);
    throw error;
  }
};