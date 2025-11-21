
import React, { useState, useEffect } from 'react';
import '../../styles/components.css';

const PaymentModal = ({ item, type, onClose, onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const balance = item.amount - item.paid;
  const maxAmount = Math.min(balance, item.amount - item.paid);

  useEffect(() => {
    // Auto-fill description based on type
    const defaultDescription = type === 'construction' 
      ? `Payment for ${item.name} stage`
      : `Payment for ${item.name}`;
    
    setPaymentData(prev => ({
      ...prev,
      description: defaultDescription
    }));
  }, [item, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentData.amount > balance) {
      alert('Payment amount cannot exceed the balance amount');
      return;
    }

    if (paymentData.amount <= 0) {
      alert('Payment amount must be greater than 0');
      return;
    }

    onSubmit({
      amount: parseInt(paymentData.amount),
      date: paymentData.date,
      description: paymentData.description
    });
  };

  const handleAmountChange = (amount) => {
    setPaymentData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  const quickAmounts = [10000, 25000, 50000, 100000];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Payment - {item.name}</h3>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Date</label>
            <input
              type="date"
              className="form-control"
              value={paymentData.date}
              onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={paymentData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={`Enter amount (max: ₹${maxAmount.toLocaleString('en-IN')})`}
              min="1"
              max={maxAmount}
              required
            />
            <div className="balance-info">
              Balance: ₹{balance.toLocaleString('en-IN')} | 
              Remaining: ₹{(balance - (parseInt(paymentData.amount) || 0)).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="quick-amounts">
            <label>Quick Select:</label>
            <div className="amount-buttons">
              {quickAmounts.map(amount => (
                amount <= balance && (
                  <button
                    key={amount}
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleAmountChange(amount)}
                  >
                    ₹{amount.toLocaleString('en-IN')}
                  </button>
                )
              ))}
              {balance > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleAmountChange(balance)}
                >
                  Full Balance (₹{balance.toLocaleString('en-IN')})
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={paymentData.description}
              onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
              rows="3"
              placeholder="Enter payment description"
              required
            />
          </div>

          <div className="payment-summary">
            <div className="summary-item">
              <span>Total Amount:</span>
              <span>₹{item.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item">
              <span>Already Paid:</span>
              <span>₹{item.paid.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item">
              <span>Current Balance:</span>
              <span>₹{balance.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item highlight">
              <span>This Payment:</span>
              <span>₹{(parseInt(paymentData.amount) || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item">
              <span>New Balance:</span>
              <span>₹{(balance - (parseInt(paymentData.amount) || 0)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              <i className="fas fa-save"></i> Save Payment
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;