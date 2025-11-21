import React from 'react';
import '../../styles/components.css';

const StageCard = ({ stage, onEdit, onDelete, onAddPayment }) => {
  const balance = stage.amount - stage.paid;
  const paymentPercentage = stage.amount > 0 ? Math.round((stage.paid / stage.amount) * 100) : 0;

  const getStatusIcon = () => {
    switch (stage.status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'in-progress':
        return 'fas fa-tools';
      default:
        return 'fas fa-clock';
    }
  };

  const getStatusColor = () => {
    switch (stage.status) {
      case 'completed':
        return '#27ae60';
      case 'in-progress':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = () => {
    switch (stage.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <div className={`stage-card ${stage.status}`}>
      <div className="stage-header">
        <div className="stage-info">
          <h3 className="stage-title">{stage.name}</h3>
          <div className="stage-meta">
            <span className="stage-percentage">{stage.percentage}% of total cost</span>
            {stage.status === 'completed' && stage.date && (
              <span className="stage-status-completed">
                <i className="fas fa-check"></i> Completed on {stage.date}
              </span>
            )}
            {stage.status === 'in-progress' && stage.date && (
              <span className="stage-status-progress">
                <i className="fas fa-tools"></i> Started on {stage.date}
              </span>
            )}
            {stage.status === 'pending' && (
              <span className="stage-status-pending">
                <i className="fas fa-clock"></i> Not started
              </span>
            )}
          </div>
        </div>
        <div className="stage-status">
          <i 
            className={getStatusIcon()} 
            style={{ color: getStatusColor(), fontSize: '1.5rem' }}
            title={getStatusText()}
          ></i>
        </div>
      </div>

      <div className="stage-details">
        <div className="stage-amount">
          Total: ₹{stage.amount.toLocaleString('en-IN')}
        </div>
        
        {stage.notes && (
          <div className="stage-notes">
            <p>{stage.notes}</p>
          </div>
        )}
      </div>

      <div className="stage-payment-progress">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ 
              width: `${paymentPercentage}%`,
              background: paymentPercentage === 100 ? '#27ae60' : '#3498db'
            }}
          ></div>
        </div>
        <div className="progress-info">
          <span>{paymentPercentage}% Paid</span>
          <span>₹{stage.paid.toLocaleString('en-IN')} / ₹{stage.amount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="stage-payment-info">
        <div className="paid-section">
          <span className="paid-label">Paid:</span>
          <span className="paid-amount">₹{stage.paid.toLocaleString('en-IN')}</span>
        </div>
        <div className="balance-section">
          <span className="balance-label">Balance:</span>
          <span className="balance-amount">₹{balance.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="stage-actions">
        <button 
          className="btn btn-success btn-sm"
          onClick={onAddPayment}
          disabled={balance === 0}
          title={balance === 0 ? 'No balance remaining' : 'Add payment'}
        >
          <i className="fas fa-plus"></i> Add Payment
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onEdit}
          title="Edit stage"
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={onDelete}
          title="Delete stage"
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default StageCard;