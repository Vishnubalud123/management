import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components.css';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-hard-hat"></i>
            <h1>PGK Construction</h1>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                  <i className="fas fa-home"></i> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/construction" className={`nav-link ${isActive('/construction')}`}>
                  <i className="fas fa-tools"></i> Construction
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/expenses" className={`nav-link ${isActive('/expenses')}`}>
                  <i className="fas fa-receipt"></i> Expenses
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/clients" className={`nav-link ${isActive('/clients')}`}>
                  <i className="fas fa-users"></i> Clients
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/payment-history" className={`nav-link ${isActive('/payment-history')}`}>
                  <i className="fas fa-history"></i> Payment History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;