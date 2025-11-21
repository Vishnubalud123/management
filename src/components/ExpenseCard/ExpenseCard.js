
import React from 'react';
import '../../styles/components.css';

const ExpenseCard = ({ expense, onEdit, onDelete, onAddPayment }) => {
  const balance = expense.amount - expense.paid;
  const paymentPercentage = expense.amount > 0 ? Math.round((expense.paid / expense.amount) * 100) : 0;

  const getCategoryIcon = () => {
    const icons = {
      'borewell': 'fas fa-water',
      'sump': 'fas fa-tint',
      'septic-tank': 'fas fa-recycle',
      'electrical': 'fas fa-bolt',
      'plumbing': 'fas fa-wrench',
      'material': 'fas fa-box',
      'labor': 'fas fa-hard-hat',
      'other': 'fas fa-receipt'
    };
    return icons[expense.category] || 'fas fa-receipt';
  };

  const formatCategory = (category) => {
    const categoryMap = {
      'borewell': 'Borewell',
      'sump': 'Sump',
      'septic-tank': 'Septic Tank',
      'electrical': 'Electrical',
      'plumbing': 'Plumbing',
      'material': 'Material',
      'labor': 'Labor',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className={`expense-card ${expense.status}`}>
      <div className="expense-header">
        <div className="expense-info">
          <h3 className="expense-title">{expense.name}</h3>
          <div className="expense-meta">
            <span className="expense-category">{formatCategory(expense.category)}</span>
            <span className="expense-date">{expense.date}</span>
          </div>
        </div>
        <div className="expense-icon">
          <i className={getCategoryIcon()} style={{ color: expense.status === 'paid' ? '#27ae60' : '#f39c12' }}></i>
        </div>
      </div>

      <div className="expense-details">
        <div className="expense-amount">
          Total: ₹{expense.amount.toLocaleString('en-IN')}
        </div>
        
        {expense.notes && (
          <div className="expense-notes">
            <p>{expense.notes}</p>
          </div>
        )}
      </div>

      <div className="expense-payment-progress">
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
          <span>₹{expense.paid.toLocaleString('en-IN')} / ₹{expense.amount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="expense-payment-info">
        <div className="paid-section">
          <span className="paid-label">Paid:</span>
          <span className="paid-amount">₹{expense.paid.toLocaleString('en-IN')}</span>
        </div>
        <div className="balance-section">
          <span className="balance-label">Balance:</span>
          <span className="balance-amount">₹{balance.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="expense-actions">
        <button 
          className="btn btn-success btn-sm"
          onClick={onAddPayment}
          disabled={balance === 0}
        >
          <i className="fas fa-plus"></i> Add Payment
        </button>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onEdit}
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;