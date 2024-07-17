function updateHotelInfo() {
    fetch('https://api.allorigins.win/get?url=https://demopms.citruspms.site/api/IBE_Hoteldetail.aspx')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.contents);
            try {
                const cleanData = data.contents.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                const hotelData = JSON.parse(cleanData);
                const hotelCode = hotelData.hotelcode;
                const hotelName = hotelData.hotelname;
                const logoUrl = hotelData.logourl;

                document.querySelector('h2#hotelName').textContent = `${hotelName} Hotel ID: ${hotelCode}`;
                
                // Update the logo
                const logoImg = document.getElementById('hotelLogo');
                if (logoImg && logoUrl) {
                    logoImg.src = logoUrl;
                    logoImg.alt = `${hotelName} Logo`;
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.querySelector('h2#hotelName').textContent = 'Error Parsing';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('h2#hotelName').textContent = 'Failed to load hotel information';
        });
}

// Call the function to update hotel info
updateHotelInfo();