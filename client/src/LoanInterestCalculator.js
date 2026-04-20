import React, { useState } from "react";
import  './Login.css';

function LoanInterestCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ================= CALCULATION =================
  const calculateLoan = () => {
    setError("");

    const P = parseFloat(amount);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    // Validation
    if (!P || !R || !T || P <= 0 || R <= 0 || T <= 0) {
      setError("Please enter valid positive values.");
      setResult(null);
      return;
    }

    // Simple Interest Formula
    const interest = (P * R * T) / 100;
    const total = P + interest;

    setResult({
      interest: interest.toFixed(2),
      total: total.toFixed(2),
    });
  };

  // ================= RESET =================
  const resetForm = () => {
    setAmount("");
    setRate("");
    setTime("");
    setResult(null);
    setError("");
  };

  return (
    <div>
    <div className="loan-container">
      <section className="loan-card">
        <h2>🏦 Loan Interest Calculator</h2>

        <label>Loan Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter loan amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Interest Rate (% per year)</label>
        <input
          type="number"
          placeholder="Enter interest rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <label>Time (Years)</label>
        <input
          type="number"
          placeholder="Enter duration"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <div className="btn-group">
          <button onClick={calculateLoan}>Calculate</button>
          <button className="reset" onClick={resetForm}>
            Reset
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-box">
            <h3>Calculation Result</h3>
            <p>Interest: ₹{result.interest}</p>
            <p>Total Amount Payable: ₹{result.total}</p>
          </div>
        )}
      </section>
    </div>
     <footer>
        © 2026 MyBank. All rights reserved.
      </footer>
    </div>
  );
}

export default LoanInterestCalculator;