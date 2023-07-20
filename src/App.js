import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/form";
import MapPage from "./components/simulation_drone";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/simulation_drone" element={<MapPage />} />
      </Routes>
    </Router>
  );
};

export default App;
