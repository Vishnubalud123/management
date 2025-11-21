
import React from 'react';
import '../../styles/components.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-hard-hat"></i>
            PGK Construction
          </div>
          <div className="footer-copyright">
            &copy; 2025 All Rights Reserved by VishnuBalu
          </div>
          <div className="footer-links">
            <a href="tel:+919876543210" className="footer-link">
              <i className="fas fa-phone"></i> Contact
            </a>
            <a href="mailto:info@pgkconstruction.com" className="footer-link">
              <i className="fas fa-envelope"></i> Email
            </a>
            <a href="#" className="footer-link">
              <i className="fas fa-map-marker-alt"></i> Location
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;