import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Withdrawal from './component/Withdrawal';

import Login from './component/Login/Login';
import Signup from './component/Signup/Signup';
import Header from './component/Header';
import Admin from './component/Admin/Admin';
import Deposite from './component/Deposite';
import ProtectedRoute from './component/ProtectedRoute'; // New component for protected routes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} />}
        />
         <Route path="/deposit" element={<Deposite />} />
         <Route path="/withdraw" element={<Withdrawal />} />
      </Routes>
    </Router>
     
  );
}

export default App;
