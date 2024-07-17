// index.js
document.addEventListener('DOMContentLoaded', function() {
    updateHotelInfo();
});

function updateHotelInfo() {
    fetch('https://roomsnet2.onrender.com/api/bookings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data received from db.json

            // Update hotel name and ID
            const hotelNameElement = document.getElementById('hotelName');
            const hotelIdElement = document.getElementById('hotelId');
            
            if (hotelNameElement && hotelIdElement) {
                hotelNameElement.textContent = `${data.hotelName} Hotel ID: ${data.hotelId}`;
                hotelIdElement.textContent = `${data.hotelId}`;
            }

            // Update the logo
            const logoImg = document.getElementById('hotelLogo');
            if (logoImg && data.logoUrl) {
                logoImg.src = data.logoUrl;
                logoImg.alt = `${data.hotelName} Logo`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle errors in fetching data
        });
}
