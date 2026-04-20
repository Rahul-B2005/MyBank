import React, { useState, useEffect } from "react";
import "./App.css";
import image5 from "./image5.jpg";
import image4 from "./image4.png";
import image6 from "./image6.png";
import image7 from "./image7.jpg";

function Services() {
  const services = [
    {
      title: "Savings Accounts",
      icon: "fas fa-piggy-bank",
      image: image5,
    },
    {
      title: "Personal Loans",
      icon: "fas fa-credit-card",
      image: image4,
    },
    {
      title: "Online Banking",
      icon: "fas fa-globe",
      image: image6,
    },
    {
      title: "Credit Cards",
      icon: "fas fa-credit-card",
      image: image7,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentService = services[currentIndex];

  return (
    <div className="services-container">
      <h2 className="h5">Our Services</h2>

      <div className="slider">
        <p>
          <i className={currentService.icon}></i> {currentService.title}
        </p>

        <img
          src={currentService.image}
          alt={currentService.title}
          style={{ width: "35%", height: "35%" }}
        />
      </div>

      <footer>&copy; 2026 MyBank. All rights reserved.</footer>
    </div>
  );
}

export default Services;