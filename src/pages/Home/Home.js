
import React from 'react';
import { Link } from 'react-router-dom';
import HouseModel from '../../components/HouseModel/HouseModel';
import { useConstruction } from '../../context/ConstructionContext';
import { HOUSE_SPECIFICATIONS } from '../../utils/constants';
import '../../styles/pages.css';

const Home = () => {
  const { projectData, overallProgress } = useConstruction();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Professional Construction Management</h1>
              <p>Complete project tracking, expense management, and progress monitoring for your construction projects</p>
              <div className="hero-buttons">
                <Link to="/construction" className="btn btn-primary">
                  <i className="fas fa-tools"></i> Track Construction
                </Link>
                <Link to="/clients" className="btn btn-secondary">
                  <i className="fas fa-users"></i> View Clients
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <HouseModel />
            </div>
          </div>
        </div>
      </section>

      <section className="project-overview-section">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2>Project Overview</h2>
              <a href="/assets/quotation.pdf" className="btn btn-success" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-download"></i> Download Quotation
              </a>
            </div>
            
            <div className="project-overview">
              <div className="overview-card">
                <i className="fas fa-user-hard-hat"></i>
                <h3>Engineer</h3>
                <div className="value">{projectData.engineer}</div>
              </div>
              <div className="overview-card">
                <i className="fas fa-calculator"></i>
                <h3>Per Sqft Rate</h3>
                <div className="value">₹{projectData.perSqftRate.toLocaleString('en-IN')}</div>
              </div>
              <div className="overview-card">
                <i className="fas fa-ruler-combined"></i>
                <h3>Total Sqft</h3>
                <div className="value">{projectData.totalSqft} Sqft</div>
              </div>
              <div className="overview-card">
                <i className="fas fa-rupee-sign"></i>
                <h3>Total Cost</h3>
                <div className="value">₹{projectData.totalCost.toLocaleString('en-IN')}</div>
              </div>
              <div className="overview-card">
                <i className="fas fa-chart-line"></i>
                <h3>Progress</h3>
                <div className="value">{overallProgress}%</div>
              </div>
              <div className="overview-card">
                <i className="fas fa-calendar"></i>
                <h3>Last Updated</h3>
                <div className="value">{projectData.lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="specifications-section">
        <div className="container">
          <div className="card specifications">
            <div className="card-header">
              <h2>House Specifications</h2>
            </div>
            
            <div className="spec-grid">
              {HOUSE_SPECIFICATIONS.map((spec, index) => (
                <div key={index} className="spec-item">
                  <i className={spec.icon}></i>
                  <div>
                    <h3>{spec.title}</h3>
                    <p>{spec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="quick-stats-section">
        <div className="container">
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-info">
                <h3>50+</h3>
                <p>Projects Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="stat-info">
                <h3>15+</h3>
                <p>Years Experience</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-award"></i>
              </div>
              <div className="stat-info">
                <h3>100%</h3>
                <p>Client Satisfaction</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="stat-info">
                <h3>₹50Cr+</h3>
                <p>Total Projects Value</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;