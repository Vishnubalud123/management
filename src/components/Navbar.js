import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Building2,
    Wallet,
    BarChart3,
    Receipt,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import '../styles/App.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={20} /> },
        { path: '/construction', label: 'Construction', icon: <Building2 size={20} /> },
        { path: '/expenses', label: 'Expenses', icon: <Wallet size={20} /> },
        { path: '/payment-history', label: 'History', icon: <Receipt size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${darkMode ? 'dark' : ''}`} style={{
            background: darkMode ? 'var(--secondary)' : 'var(--primary)',
            padding: '1rem 2rem',
            boxShadow: 'var(--shadow)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            transition: 'var(--transition)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    color: darkMode ? 'var(--primary)' : 'var(--secondary)',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                }}>
                    <Building2 size={28} />
                    <span>My Construction Tracker</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive(link.path)
                                    ? (darkMode ? 'var(--accent)' : 'white')
                                    : (darkMode ? 'var(--text-light)' : 'var(--secondary)'),
                                fontWeight: isActive(link.path) ? 'bold' : 'normal',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: isActive(link.path) ? 'rgba(0,0,0,0.1)' : 'transparent',
                                transition: 'var(--transition)'
                            }}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}

                    <button
                        onClick={toggleDarkMode}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: darkMode ? 'var(--primary)' : 'var(--secondary)',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'none' }} // Hidden by default, shown in media query via CSS
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: darkMode ? 'var(--secondary)' : 'var(--primary)',
                    padding: '1rem',
                    boxShadow: 'var(--shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                textDecoration: 'none',
                                color: darkMode ? 'var(--text-light)' : 'var(--secondary)',
                                padding: '10px',
                                borderRadius: '8px',
                                background: isActive(link.path) ? 'rgba(0,0,0,0.1)' : 'transparent'
                            }}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
