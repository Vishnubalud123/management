
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-animation">
            <i className="fas fa-hard-hat"></i>
            <i className="fas fa-tools"></i>
            <i className="fas fa-home"></i>
          </div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home"></i> Back to Home
            </Link>
            <Link to="/construction" className="btn btn-secondary">
              <i className="fas fa-tools"></i> View Construction
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;