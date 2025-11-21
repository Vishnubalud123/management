import React from 'react';
import '../../styles/components.css';

const PaymentHistory = ({ payments, type, stages = [], expenses = [], onDeletePayment, title }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemName = (itemId) => {
    if (type === 'construction') {
      const stage = stages.find(s => s.id === itemId);
      return stage ? stage.name : 'Unknown Stage';
    } else {
      const expense = expenses.find(e => e.id === itemId);
      return expense ? expense.name : 'Unknown Expense';
    }
  };

  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      'cash': 'money-bill',
      'bank-transfer': 'university',
      'cheque': 'money-check',
      'upi': 'mobile-alt',
      'online': 'credit-card'
    };
    return methodIcons[method] || 'money-bill';
  };

  const getPaymentMethodLabel = (method) => {
    const methodLabels = {
      'cash': 'Cash',
      'bank-transfer': 'Bank Transfer',
      'cheque': 'Cheque',
      'upi': 'UPI',
      'online': 'Online Payment'
    };
    return methodLabels[method] || method;
  };

  if (payments.length === 0) {
    return (
      <div className="payment-history card">
        <div className="card-header">
          <h3>{title}</h3>
        </div>
        <div className="empty-payments">
          <i className="fas fa-receipt"></i>
          <p>No payment records found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history card">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="payment-count">{payments.length} payments</span>
      </div>
      
      <div className="payments-list">
        {payments.map((payment) => (
          <div key={payment.id} className="payment-item">
            <div className="payment-main">
              <div className="payment-icon">
                <i className={`fas fa-${getPaymentMethodIcon(payment.method)}`}></i>
              </div>
              <div className="payment-details">
                <div className="payment-header">
                  <h4>{getItemName(payment.itemId)}</h4>
                  <span className="payment-amount">₹{payment.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="payment-meta">
                  <span className="payment-date">
                    <i className="fas fa-calendar"></i>
                    {formatDate(payment.date)}
                  </span>
                  <span className="payment-method">
                    <i className={`fas fa-${getPaymentMethodIcon(payment.method)}`}></i>
                    {getPaymentMethodLabel(payment.method)}
                  </span>
                </div>
                {payment.description && (
                  <p className="payment-description">{payment.description}</p>
                )}
              </div>
            </div>
            <div className="payment-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDeletePayment(payment.id)}
                title="Delete payment"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="payment-summary-footer">
        <div className="summary-item">
          <span>Total Payments:</span>
          <span>₹{payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-item">
          <span>Number of Payments:</span>
          <span>{payments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;