import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import ProgressBar from "./progressbar-form";

import configData from "../config.json";

const weaponTypes = {
  individual: ["M4", "M249", "M17", "M110", "M2010", "M107"],
  groundCrew: ["M240", "M2", "MK19"],
  vehicleCrew: ["Abrams", "BFV", "Stryker"],
  collective: ["Squad", "Platoon", "Company"]
};

function Form() {
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("");
  const [numberToTrain, setNumberToTrain] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(selectedEvent !== '' && selectedWeapon !== '' && numberToTrain > 0);
  }, [selectedEvent, selectedWeapon, numberToTrain]);
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
    setSelectedWeapon(weaponTypes[event][0]);
    setNumberToTrain(0);
  };

  // Handler for weapon type dropdown
  const handleWeaponChange = (event) => {
    setSelectedWeapon(event.target.value);
  };

  // Handler for number to train textbox
  const handleNumberChange = (event) => {
    setNumberToTrain(event.target.value);
  };

  const nextButtonStyle = {
    width: '100px', // Set the width you prefer for the bigger button
    height: '30px', // Set the height you prefer for the bigger button
    backgroundColor: isFormValid ? '#FFD130' : 'grey',
    opacity: isFormValid ? 1 : 0.5,
    pointerEvents: isFormValid ? 'auto' : 'none', // Disables the button interaction when form is invalid
    borderRadius: '4px',
  };

  // Optional: Handler for when you want to save the details
  const handleSaveDetails = async () => {
    console.log('Save details handler called');
    try {
      const trainingDetails = {
        event: selectedEvent,
        weapon: selectedWeapon,
        number: numberToTrain
      };
  
      const response = await fetch(configData.SERVER_URL+"/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingDetails),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      navigate('/table', { state: trainingDetails });
      //navigate('/table');

    } catch (error) {
      console.error("Failed to save details and navigate:", error);
    }
  };
  

  // A function to get button classes
  const getButtonClasses = (event) => {
    let classes = `btn btn-primary btn-lg rounded mb-3`;
    if (selectedEvent === event) {
      classes += ' btn-active';
    }
    if (["groundCrew", "vehicleCrew", "collective"].includes(event)) {
      classes += ' disabled-button';
    }
    return classes;
  };

  return (
    <div className="form-container mt-main">
      <ProgressBar />
      <div className="selection-container">
        <h4><strong>Select Event Type:</strong></h4>
        <div className="btn-group mt-3">
          {Object.keys(weaponTypes).map((event) => (
            <button
              key={event}
              onClick={() => handleEventClick(event)}
              className={getButtonClasses(event)}
            >
              {event.charAt(0).toUpperCase() + event.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <br/>

      {showDetails && (
        <>
          <h4 className="mb-4 mx-auto"><strong>Training Details:</strong></h4>
          <div className="container mt-1 container-section">
            <div className="row">
              <div className="col-md-8 form-container">
                <div className="mb-4">
                  <label htmlFor="dropdown" className="form-label1 mb-2">Weapon Type</label>
                  <select className="form-select" id="dropdown" value={selectedWeapon} onChange={handleWeaponChange}>
                    {weaponTypes[selectedEvent].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4 form-container">
                <div className="mb-4 mx-auto">
                  <label htmlFor="textBox" className="form-label2 mb-2">Number to Train</label>
                  <input 
                  type="number" 
                  className="form-control" 
                  id="textBox"
                  value={numberToTrain} 
                  onChange={handleNumberChange}
                  placeholder="Enter number" 
                  style={{ width: "100%", padding: "5px" }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <br/>
          <br/>

          <button
            onClick={handleSaveDetails}
            className="btn btn-submit float-end"
            style={nextButtonStyle}
            disabled={!isFormValid} // This property will make the button not clickable when the form is invalid
          >
            NEXT
          </button>
        </>
      )}
    </div>
  );
}

export default Form;

