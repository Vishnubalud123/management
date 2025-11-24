import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, color = 'var(--accent)', height = '10px' }) => {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div style={{
            width: '100%',
            height: height,
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '10px'
        }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    height: '100%',
                    background: color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '5px'
                }}
            >
                {clampedProgress > 10 && (
                    <span style={{
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        lineHeight: 1
                    }}>
                        {Math.round(clampedProgress)}%
                    </span>
                )}
            </motion.div>
        </div>
    );
};

export default ProgressBar;
