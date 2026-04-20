import { useState } from "react";
import "./Contact.css";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ✅ popup state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // ✅ show success popup
      setPopup({
        show: true,
        message: data.message,
        type: "success"
      });

      setForm({ name: "", email: "", message: "" });

    } catch (err) {
      setPopup({
        show: true,
        message: "Server error!",
        type: "error"
      });
    }
  };

  // close popup
  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  return (
    <div>

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <h3>{popup.type === "success" ? "✅ Success" : "❌ Error"}</h3>
            <p>{popup.message}</p>

            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}

      {/* ================= CONTACT ================= */}
      <section className="contact-container">

        <section className="contact-details">
          <h3>Contact Details</h3>
          <p><strong>Phone:</strong> +1 234 567 8901</p>
          <p><strong>Email:</strong> contact@example.com</p>
          <p><strong>Address:</strong> 123 Main Street, City, Country</p>
        </section>

        <form onSubmit={handleSubmit}>
          <h3>Contact Us</h3>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send</button>
        </form>

      </section>

      <footer>
        &copy; 2026 MyBank. All rights reserved.
      </footer>

    </div>
  );
}