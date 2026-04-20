import React, { useState, useEffect } from "react";
import "./Login.css";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {

  /* ================= STATES ================= */
  const [isFlipped, setIsFlipped] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  const [loginCaptcha, setLoginCaptcha] = useState(null);
  const [registerCaptcha, setRegisterCaptcha] = useState(null);

  /* ================= AUTO CLOSE POPUP ================= */
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  /* ================= LOGIN ================= */
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginCaptcha) {
      setPopupMessage("Please verify CAPTCHA");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const form = event.target;

    const data = {
      username: form.username.value,
      password: form.password.value,
      captcha: loginCaptcha
    };

    try {
      const response = await fetch("http://localhost:8001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("user", JSON.stringify(result.user));

        setPopupMessage("Login Successful!");
        setPopupType("success");
        setShowPopup(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

      } else {
        setPopupMessage(result.message || "Login failed");
        setPopupType("error");
        setShowPopup(true);
      }

    } catch (error) {
      setPopupMessage("Server Error");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registerCaptcha) {
      setPopupMessage("Please verify CAPTCHA");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const form = event.target;

    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      captcha: registerCaptcha
    };

    try {
      const response = await fetch("http://localhost:8001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setPopupMessage("Registration Successful!");
        setPopupType("success");
        setShowPopup(true);
        form.reset();
      } else {
        setPopupMessage(result.message || "Registration failed");
        setPopupType("error");
        setShowPopup(true);
      }

    } catch (error) {
      setPopupMessage("Registration Error");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  /* ================= UI ================= */
  return (
    <div>
    <div className="auth-container">

      <div className={`flip-card ${isFlipped ? "active" : ""}`}>
        <div className="flip-inner">

          {/* ===== LOGIN ===== */}
          <div className="flip-front">
            <h2>Login</h2>

            <form class="dd8" onSubmit={handleLogin}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="password" name="password" placeholder="Password" required />

              <ReCAPTCHA
                sitekey="6LdjKqksAAAAAGA9pIC-G5eWMgjIBOyOy57AgJgL"
                onChange={(value) => setLoginCaptcha(value)}
              />

              <button type="submit">Login</button>
            </form>

            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsFlipped(true)}>Register</span>
            </p>
          </div>

          {/* ===== REGISTER ===== */}
          <div className="flip-back">
            <h2>Register</h2>

            <form class="dd8" onSubmit={handleRegister}>
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />

              <ReCAPTCHA
                sitekey="6LdjKqksAAAAAGA9pIC-G5eWMgjIBOyOy57AgJgL"
                onChange={(value) => setRegisterCaptcha(value)}
              />

              <button type="submit">Register</button>
            </form>

            <p>
              Already have an account?{" "}
              <span onClick={() => setIsFlipped(false)}>Login</span>
            </p>
          </div>

        </div>
      </div>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${popupType}`}>
            <h3>{popupType === "success" ? "✅ Success" : "❌ Error"}</h3>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
       
    </div>
    <footer>&copy; 2026 MyBank. All rights reserved.</footer>
    </div>
  );
}

export default Login;