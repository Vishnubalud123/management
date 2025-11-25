import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#222831' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-warning fw-bold" to="/">
          <i className="fas fa-hard-hat me-2"></i>
          PGK Construction
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link text-light ${isActive('/')}`} to="/">
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-light ${isActive('/construction')}`} to="/construction">
                <i className="fas fa-tools me-1"></i> Construction
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-light ${isActive('/expenses')}`} to="/expenses">
                <i className="fas fa-receipt me-1"></i> Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-light ${isActive('/clients')}`} to="/clients">
                <i className="fas fa-users me-1"></i> Clients
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link text-light ${isActive('/payment-history')}`} to="/payment-history">
                <i className="fas fa-history me-1"></i> Payment History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;