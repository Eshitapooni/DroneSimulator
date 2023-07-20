import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";

const Form = () => {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [time, setTime] = useState("0");
  const [disabled, setDisabled] = useState(true);

  const validate_Time = (time) => {
    time = parseFloat(time);
    if (time < 0) {
      alert("Time can not be less than 0 !");
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const validate_Latitude = (latitude) => {
    latitude = parseFloat(latitude);
    if (latitude < -90 || latitude > 90) {
      alert("Latitude out of Range [-90,90]");
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const validate_Longitude = (longitude) => {
    longitude = parseFloat(longitude);
    if (longitude < -180 || longitude > 180) {
      alert("Latitude out of Range [-180,180]");
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const handleSubmit = (e) => {
    if (latitude === "" || isNaN(latitude)) {
      alert("Latitude can not be empty");
      setDisabled(true);
      return;
    }
    if (time === "" || isNaN(time)) {
      alert("Time can not be empty");
      setDisabled(true);
      return;
    }
    if (longitude === "" || isNaN(longitude)) {
      alert("Longitude can not be empty");
      setDisabled(true);
      return;
    }
    e.preventDefault();
    if (!disabled)
      navigate(
        `/simulation_drone?latitude=${latitude}&longitude=${longitude}&time=${time}`
      );
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="box-title">Drone Simulation</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Latitude:
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => {
                setLatitude(e.target.value);
                validate_Latitude(e.target.value);
              }}
              className="input"
            />
          </label>
          <br />
          <label>
            Longitude:
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => {
                setLongitude(e.target.value);
                validate_Longitude(e.target.value);
              }}
              className="input"
            />
          </label>
          <br />
          <label>
            Time:
            <input
              type="number"
              step="any"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                validate_Time(e.target.value);
              }}
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="button" disabled={disabled}>
            Run Simulation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
