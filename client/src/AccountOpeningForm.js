import { useState } from "react";
import "./Account.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AccountOpenForm() {

  // ================= STATE =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    accountType: "Savings",
    initialDeposit: ""
  });

  const [accountNumber, setAccountNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      accountType: "Savings",
      initialDeposit: ""
    });
  };

  // ================= PDF PASSBOOK =================
  const downloadPassbook = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Bank Passbook", 70, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Account Number", accountNumber],
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Address", form.address],
        ["City", form.city],
        ["Pincode", form.pincode],
        ["Account Type", form.accountType],
        ["Opening Balance", form.initialDeposit]
      ]
    });

    doc.save("Passbook.pdf");
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/account/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setAccountNumber(data.accountNumber);
        setShowPopup(true);
        setMessage("");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server Error");
    }
  };

  // ================= UI =================
  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Open Bank Account</h2>

          <input
            name="name"
            value={form.name}
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            name="address"
            value={form.address}
            placeholder="Address"
            onChange={handleChange}
            required
          />

          <input
            name="city"
            value={form.city}
            placeholder="City"
            onChange={handleChange}
            required
          />

          <input
            name="pincode"
            value={form.pincode}
            placeholder="Pincode"
            onChange={handleChange}
            required
          />

          <select
            name="accountType"
            value={form.accountType}
            onChange={handleChange}
          >
            <option>Savings</option>
            <option>Current</option>
          </select>

          <input
            name="initialDeposit"
            type="number"
            value={form.initialDeposit}
            placeholder="Initial Deposit"
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>

          {message && <p className="success">{message}</p>}
        </form>

      {/* ================= POPUP ================= */}
         {showPopup && (
            <div className="popup-overlay">
             <div className="popup-box">

             <h3 className="success">✅ Account Created Successfully</h3>
             <p>Your Account Number</p>
            <h2>{accountNumber}</h2>

           <div className="popup-actions">
           <button
             onClick={() => {
              resetForm();
              setShowPopup(false);
             }}
            >
             OK
           </button>

           <button className="outline" onClick={downloadPassbook}>
            Download Passbook
           </button>
          </div>

         </div>
        </div>
      )}
      
      </div>

      <footer>
        &copy; 2026 MyBank. All rights reserved.
      </footer>
    </div>
  );
}