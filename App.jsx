import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import RoomManagement from './components/RoomManagement';
import RoomDetails from './components/RoomDetails'; // Import RoomDetails

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomManagement />} />
        <Route path="/rooms/:id" element={<RoomDetails />} /> {/* New Route for Room Details */}
      </Routes>
    </Router>
  );
}

export default App;
