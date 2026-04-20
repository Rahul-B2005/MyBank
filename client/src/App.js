import './App.css';
import Home from './Home';
import About from './About';
import Services from './Services';
import LoanInterestCalculator from './LoanInterestCalculator';
import Contact from './Contact';
import Login from './Login';
import AccountOpeningForm from './AccountOpeningForm';
import TransactionForm from './TransactionForm';
import ProtectedRoute from './ProtectedRoute';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import React, { useState, useEffect } from 'react';

function App() {

  // ================= STATE =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // ⭐ popup state
  const [showPopup, setShowPopup] = useState(false);

  // ================= LOAD LOGIN DATA =================
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");

    setIsLoggedIn(loginStatus);
    setUsername(storedUsername);
  }, []);

  // ================= LOGOUT CLICK =================
  const handleLogout = () => {
    setShowPopup(true); // open popup
  };

  // ================= CONFIRM LOGOUT =================
  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");
    setShowPopup(false);

    window.location.href = "/login";
  };

  return (
    <Router>
      {/* ================= NAVBAR ================= */}
      <nav>
        <header>
          <h1>
            <i className="fas fa-university"></i> MyBank
          </h1>
        </header>

        <ul>
          <li><a href="/"><i className="fas fa-home"></i> Home</a></li>
          <li><a href="/about"><i className="fas fa-info-circle"></i> About</a></li>
          <li><a href="/services"><i className="fas fa-cogs"></i> Services</a></li>
          <li><a href="/loan-interest"><i className="fas fa-file-invoice-dollar"></i> Loan Interest</a></li>
          <li><a href="/contact"><i className="fas fa-envelope"></i> Contact</a></li>
          <li><a href="/AccountOpeningForm"><i className="fas fa-user"></i> Open Account</a></li>
          <li><a href="/TransactionForm"><i className="fa-solid fa-money-bill-transfer"></i> Transaction</a></li>

          {isLoggedIn ? (
            <li className="user-section">
              <span className="username">
                <i className="fa-solid fa-circle-user"></i>
                {username || "User"}
              </span>

              <button className="dd5" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <a href="/login">
                <i className="fas fa-sign-in-alt"></i> Login/Register
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* ================= ROUTES ================= */}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/services" component={Services} />
        <Route path="/loan-interest" component={LoanInterestCalculator} />
        <Route exact path="/login" component={Login} />

        {/* 🔐 Protected Pages */}
        <ProtectedRoute exact path="/contact" component={Contact} />
        <ProtectedRoute exact path="/AccountOpeningForm" component={AccountOpeningForm} />
        <ProtectedRoute exact path="/TransactionForm" component={TransactionForm} />
      </Switch>

      {/* ================= LOGOUT POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box logout">
            <h3><i className="fa-solid fa-right-from-bracket"></i> Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="popup-buttons">
              <button className="ok-btn" onClick={confirmLogout}>
                OK
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </Router>
  );
}

export default App;