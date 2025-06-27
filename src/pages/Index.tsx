
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import WingDetails from '../components/WingDetails';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wing/:wingId" element={<WingDetails />} />
      </Routes>
    </div>
  );
};

export default Index;
