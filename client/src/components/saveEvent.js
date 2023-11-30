import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from "./progressbar-save";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

function SaveEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const tableData = location.state ? location.state.tableData : null; // Handle undefined state

  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationText, setLocationText] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [numberToTrain, setNumberToTrain] = useState('');
  const [eventType, setEventType] = useState('');
  const [weaponType, setWeaponType] = useState('');


  // Check if user is logged in
  const userId = localStorage.getItem('userId');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!userId);

  // New state variable for form validation
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form and check user login status
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    const isUserLoggedIn = !!loggedInUserId;
    setIsFormValid(!!eventName.trim() && !!startDate && !!endDate && isUserLoggedIn);
  }, [eventName, startDate, endDate]);

    // Effect for updating state based on location
  useEffect(() => {
    if (location.state) {
      setNumberToTrain(location.state.numberToTrain || 0);
      setEventType(location.state.eventType || '');
      setWeaponType(location.state.weaponType || '');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      window.alert("Please fill out the Event Name, Start Date, End Date, and ensure you are logged in.");
      return;
    }

    const userId = localStorage.getItem('userId'); // Get the user ID at submission time
    const eventData = {
      eventName,
      startDate,
      endDate,
      location: locationText,
      additionalInfo,
      tableData,
      numberToTrain,
      eventType,
      weaponType,
      userId
    };

    try {
      const response = await fetch('/saveEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.text();

      if (response.ok) {
        navigate('/myevents');
      } else {
        window.alert(data);
      }
    } catch (error) {
      window.alert("There was a problem with saving the event: " + error.message);
    }
  };

  return (
    <div className='mt-main container'>
      <ProgressBar />
      <h4 className="mb-4"><strong>Add Event's Details:</strong></h4>
      <div className='event-container'>
       {/* Form for event details */}
      <label htmlFor="eventName">Event Name <span className="required-asterisk">*</span></label>
      <input
        id="eventName"
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Enter event name"
      />

      <label htmlFor="startDate">Start Date <span className="required-asterisk">*</span></label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label htmlFor="endDate">End Date <span className="required-asterisk">*</span></label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <label htmlFor="locationText">Location</label>
      <input
        id="locationText"
        type="text"
        value={locationText}
        onChange={(e) => setLocationText(e.target.value)}
        placeholder="Enter location"
      />

      <label htmlFor="additionalInfo">Additional Info</label>
      <input
        id="additionalInfo"
        type="text"
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        placeholder="Enter additional info"
      />
      <button 
        className={`btn btn-submit ${!isFormValid ? 'disabled-button' : ''}`} 
        onClick={handleSubmit} 
        disabled={!isFormValid}
      >
        SAVE
      </button>
      {!isUserLoggedIn && (
        <p className="login-message mt-2">
          *Log in to save and manage events.
        </p>
      )}
    </div>
    </div>
  );
}

export default SaveEvent;
