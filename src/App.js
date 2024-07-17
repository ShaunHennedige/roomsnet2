// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

class App extends React.Component {
  handleLocal = () => {
    document.querySelector('.client-type').style.display = 'none';
    document.getElementById('residentForm').style.display = 'block';
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const nationalId = document.getElementById('nationalId').value;
    const dob = document.getElementById('dob').value;
    const nationalIdError = document.getElementById('nationalIdError');
    const dobError = document.getElementById('dobError');
    let isValid = true;
    if (!nationalId) {
      nationalIdError.style.display = 'block';
      isValid = false;
    } else {
      nationalIdError.style.display = 'none';
    }
    if (!dob) {
      dobError.style.display = 'block';
      isValid = false;
    } else {
      dobError.style.display = 'none';
    }
    if (isValid) {
      window.location.href = 'bookinglocal.html';
    }
  };

  updateHotelInfo = () => {
    fetch('https://api.allorigins.win/raw?url=http://207.180.252.175:7010/api/HotelDetail.aspx')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        console.log(data);
        try {
          const cleanData = data.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
          const hotelData = JSON.parse(cleanData);
          const hotelCode = hotelData.hotelcode;
          const hotelName = hotelData.hotelname;
          document.querySelector('h2#hotelName').textContent = `${hotelName} Hotel ID: ${hotelCode}`;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          document.querySelector('h2#hotelName').textContent = 'Error Parsing';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.querySelector('h2#hotelName').textContent = 'Failed to load hotel information';
      });
  };

  componentDidMount() {
    this.updateHotelInfo();
  }

  render() {
    return (
      <div className="fullwidth">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="index.html">
            <img
              src="system/images/ROOMSNET-removebg-preview.png"
              className="d-inline-block align-top"
              alt=""
              style={{ width: '150px', height: 'auto', padding: '0px', margin: '0px' }}
            />
          </a>
        </nav>
        <div id="container">
          <header>
            <div id="featured">
              <div className="client-type">
                <img
                  id="hotelLogo"
                  src="system/images/ROOMSNET-removebg-preview.png"
                  alt="Hotel Logo"
                  style={{ width: '250px', height: 'auto' }}
                />
                <br />
                <br />
                <h2 id="hotelName">Welcome to Test Hotel <br /> Hotel ID: Test ID</h2>
                <p>Please choose your Nationality:</p>
                <button className="btn btn-primary" onClick={this.handleLocal} style={{ margin: '0 10px' }}>
                  Resident
                </button>
                <button className="btn btn-primary" onClick={() => window.location.href = 'bookingforeign.html'} style={{ margin: '0 10px' }}>
                  Non-Resident
                </button>
              </div>
              <div id="residentForm" className="form-container" style={{ display: 'none' }}>
                <form onSubmit={this.handleFormSubmit} className="p-4 border rounded bg-light">
                  <div className="form-group">
                    <label htmlFor="nationalId">National ID:</label>
                    <input type="text" className="form-control" id="nationalId" placeholder="Enter National ID" />
                    <span className="error-message" id="nationalIdError">Please enter your National ID.</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" className="form-control" id="dob" />
                    <span className="error-message" id="dobError">Please enter your Date of Birth.</span>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
              <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img className="d-block w-100" src="system/images/location-1.jpg" alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block w-100" src="system/images/location-2.jpg" alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block w-100" src="system/images/location-3.jpg" alt="Third slide" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </header>
        </div>
      </div>
    );
  }
}

export default App;
