import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--secondary)',
            color: 'var(--text-light)',
            textAlign: 'center',
            padding: '1.5rem 0',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                © 2023 All Rights Reserved by <strong style={{ color: 'var(--primary)' }}>VishnuBalu</strong>
            </p>
        </footer>
    );
};

export default Footer;
