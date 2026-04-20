import { useState } from "react";
import "./Form.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TransactionForm() {

  const [form, setForm] = useState({
    accountNumber: "",
    type: "",
    amount: ""
  });

  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);
  const [popup, setPopup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState("");

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validate = () => {
    let err = {};

    if (!/^\d{10}$/.test(form.accountNumber))
      err.accountNumber = "Account must be 10 digits";

    if (!form.type)
      err.type = "Select type";

    if (!form.amount || Number(form.amount) <= 0)
      err.amount = "Invalid amount";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= FETCH PASSBOOK =================
  const fetchTransactions = async (acc) => {
    if (!acc) return alert("Enter account number");

    try {
      const res = await fetch(
        `http://localhost:8001/transactions/${acc}`
      );

      const data = await res.json();
      setTransactions(data);
      setAccount(acc);
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(
        "http://localhost:8001/transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // ✅ FIX: ensure balance always exists
      const balanceValue =
        data.balanceAfterTransaction || data.balance;

      setPopup({
        message: data.message,
        balance: balanceValue
      });

      setReceipt({
        transactionId: data.transactionId,
        accountNumber: data.accountNumber,
        type: data.type,
        amount: data.amount,
        balance: balanceValue,
        date: new Date()
      });

      // refresh passbook
      fetchTransactions(form.accountNumber);

      // reset form
      setForm({
        accountNumber: "",
        type: "",
        amount: ""
      });

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  // ================= MASK ACCOUNT =================
  const maskAccount = (acc) =>
    acc ? "XXXXXX" + acc.slice(-4) : "";

  // ================= PDF DOWNLOAD =================
  const downloadPDF = async () => {
    const element = document.getElementById("receipt");

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 180, 0);
    pdf.save("receipt.pdf");
  };

  return (
    <div>
      <div className="container">

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit}>
          <h2>Transaction</h2>

          <input
            name="accountNumber"
            value={form.accountNumber}
            placeholder="Account Number"
            onChange={handleChange}
          />
          <p className="error">{errors.accountNumber}</p>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Deposit</option>
            <option>Withdraw</option>
          </select>
          <p className="error">{errors.type}</p>

          <input
            type="number"
            name="amount"
            value={form.amount}
            placeholder="Amount"
            onChange={handleChange}
          />
          <p className="error">{errors.amount}</p>

          <button type="submit">Submit</button>

          <button
            type="button"
            onClick={() =>
              fetchTransactions(form.accountNumber)
            }
          >
            View Passbook
          </button>
        </form>

        {/* ================= RECEIPT ================= */}
        {receipt && (
          <div id="receipt" className="receipt">
            <h2>MY BANK</h2>
            <p>Txn ID: {receipt.transactionId}</p>
            <p>Account: {maskAccount(receipt.accountNumber)}</p>
            <p>Type: {receipt.type}</p>
            <p>Amount: ₹{receipt.amount}</p>
            <p>Balance: ₹{receipt.balance}</p>

            <button onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        )}

        {/* ================= PASSBOOK ================= */}
        {transactions.length > 0 && (
          <div className="passbook">
            <h2>Bank Passbook</h2>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Txn ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>
                      {new Date(
                        txn.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>{txn.transactionId}</td>
                    <td>{txn.type}</td>
                    <td>₹{txn.amount}</td>
                    <td>
                      ₹{txn.balanceAfterTransaction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= POPUP ================= */}
        {popup && (
          <div className="popup">
            <div className="popup-box">
              <h3>{popup.message}</h3>
              <p>Balance ₹{popup.balance}</p>
              <button onClick={() => setPopup(null)}>
                OK
              </button>
            </div>
          </div>
        )}

      </div>

      <footer>&copy; 2026 MyBank. All rights reserved.</footer>
    </div>
  );
}