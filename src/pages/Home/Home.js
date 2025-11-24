import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConstruction } from '../../context/ConstructionContext';
import ProgressBar from '../../components/ProgressBar';
import {
  User, Ruler, Calculator, FileDown, Calendar, Clock,
  Edit, Phone, Mail, MapPin, Home as HomeIcon, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const { projectData, totalProjectCost, overallProgress } = useConstruction();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [clientData, setClientData] = useState(() => {
    const saved = localStorage.getItem('clientData');
    return saved ? JSON.parse(saved) : {
      name: 'Vishnu Balu',
      phone: '+91 9876543210',
      email: 'vishnu@example.com',
      address: '123 Main Street, Chennai, Tamil Nadu 600001'
    };
  });
  const [showClientEdit, setShowClientEdit] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('clientData', JSON.stringify(clientData));
  }, [clientData]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all construction and expense data? This action cannot be undone.')) {
      localStorage.removeItem('construction-stages');
      localStorage.removeItem('construction-expenses');
      localStorage.removeItem('construction-payments');
      toast.success('Data reset successfully! Please refresh the page.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleSaveClient = () => {
    setShowClientEdit(false);
    toast.success('Client details updated!');
  };

  const houseSpecs = [
    { label: 'Foundation', value: 'Concrete with steel reinforcement' },
    { label: 'Structure', value: 'RCC framed structure' },
    { label: 'Walls', value: '9" thick brick walls' },
    { label: 'Plumbing', value: 'CPVC pipes with modern fixtures' },
    { label: 'Electrical', value: 'Concealed copper wiring' },
    { label: 'Finishing', value: 'Premium quality paints' }
  ];

  return (
    <div className="home-page" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/images/modern-house-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: 'calc(100vh - 80px)',
      padding: '2rem',
      color: 'white'
    }}>
      <div className="container">
        {/* Header with Date/Time */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="header-section"
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            {projectData.projectName}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '1.1rem', opacity: 0.9, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--accent)" /> {formatDate(currentDateTime)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--accent)" /> {formatTime(currentDateTime)}
            </span>
          </div>
        </motion.div>

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Project Overview Card */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'rgba(34, 40, 49, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0, color: 'var(--primary)' }}>
                Project Overview
              </h2>
              <button onClick={handleResetData} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>

            <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ background: 'rgba(245, 197, 66, 0.1)', padding: '10px', borderRadius: '50%' }}>
                <User size={24} color="var(--primary)" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Engineer</label>
                <div style={{ fontWeight: '600' }}>{projectData.engineer}</div>
              </div>
            </div>

            <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ background: 'rgba(0, 173, 181, 0.1)', padding: '10px', borderRadius: '50%' }}>
                <Ruler size={24} color="var(--accent)" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Total Area</label>
                <div style={{ fontWeight: '600' }}>{projectData.totalSqft} Sq.ft @ ₹{projectData.perSqftRate}/sqft</div>
              </div>
            </div>

            <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '50%' }}>
                <Calculator size={24} color="white" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Estimated Cost</label>
                <div style={{ fontWeight: '600' }}>₹{totalProjectCost.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: 'rgba(34, 40, 49, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>Overall Progress</h2>

            <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
                <motion.circle
                  cx="90" cy="90" r="80"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="15"
                  strokeDasharray="502"
                  strokeDashoffset={502 - (502 * overallProgress) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (502 * overallProgress) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{Math.round(overallProgress)}%</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Completed</div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <ProgressBar progress={overallProgress} height="6px" color="var(--accent)" />
            </div>
          </motion.div>
        </div>

        {/* Client Details Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: 'rgba(34, 40, 49, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Client Details</h2>
            <button onClick={() => setShowClientEdit(!showClientEdit)} className="btn btn-secondary btn-sm">
              <Edit size={16} /> Edit
            </button>
          </div>

          {showClientEdit ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              />
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                value={clientData.phone}
                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              />
              <textarea
                className="form-control"
                placeholder="Address"
                rows="2"
                value={clientData.address}
                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              />
              <button onClick={handleSaveClient} className="btn btn-success">
                Save Changes
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <User size={24} color="var(--primary)" />
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Name</label>
                  <div style={{ fontWeight: '600' }}>{clientData.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Phone size={24} color="var(--accent)" />
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Phone</label>
                  <div style={{ fontWeight: '600' }}>{clientData.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Mail size={24} color="var(--accent)" />
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Email</label>
                  <div style={{ fontWeight: '600' }}>{clientData.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <MapPin size={24} color="var(--primary)" />
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Property Address</label>
                  <div style={{ fontWeight: '600' }}>{clientData.address}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* House Specifications Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ background: 'rgba(34, 40, 49, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}
        >
          <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>House Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {houseSpecs.map((spec, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <HomeIcon size={20} color="var(--accent)" />
                <div>
                  <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>{spec.label}</label>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{spec.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Download Quotation Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ textAlign: 'center' }}
        >
          <a
            href="/assets/documents/quotation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '15px 30px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <FileDown size={24} /> Download Quotation
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;