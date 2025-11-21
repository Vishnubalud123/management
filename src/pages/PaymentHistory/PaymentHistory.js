import React from 'react';
import { useConstruction } from '../../context/ConstructionContext';
import '../../styles/pages.css';

const PaymentHistory = () => {
  const { 
    getAllPayments, 
    paidConstructionAmount, 
    paidExpensesAmount,
    totalConstructionCost,
    totalExpensesAmount
  } = useConstruction();

  const payments = getAllPayments();
  const totalPaidAmount = paidConstructionAmount + paidExpensesAmount;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentTypeColor = (type) => {
    return type === 'construction' ? '#3498db' : '#e74c3c';
  };

  const getPaymentTypeIcon = (type) => {
    return type === 'construction' ? 'fas fa-tools' : 'fas fa-receipt';
  };

  return (
    <div className="payment-history-page">
      <div className="container">
        <div className="page-header">
          <h1>Payment History</h1>
        </div>

        <div className="payment-summary">
          <div className="summary-card total">
            <i className="fas fa-money-bill-wave"></i>
            <h3>Total Paid Amount</h3>
            <div className="value">₹{totalPaidAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card construction">
            <i className="fas fa-tools"></i>
            <h3>Construction Payments</h3>
            <div className="value">₹{paidConstructionAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card expenses">
            <i className="fas fa-receipt"></i>
            <h3>Expense Payments</h3>
            <div className="value">₹{paidExpensesAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>All Payment Records</h2>
            <span className="total-records">{payments.length} payments found</span>
          </div>

          {payments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-receipt"></i>
              <h3>No Payment Records</h3>
              <p>No payments have been recorded yet.</p>
            </div>
          ) : (
            <div className="payment-table-container">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={`${payment.type}-${payment.id}`}>
                      <td className="date">{formatDate(payment.date)}</td>
                      <td>
                        <span 
                          className="payment-type-badge"
                          style={{ backgroundColor: getPaymentTypeColor(payment.type) }}
                        >
                          <i className={getPaymentTypeIcon(payment.type)}></i>
                          {payment.type === 'construction' ? 'Construction' : 'Expense'}
                        </span>
                      </td>
                      <td className="item-name">{payment.itemName}</td>
                      <td className="description">{payment.description}</td>
                      <td className="amount">₹{payment.amount.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="payment-method">
                          {payment.method === 'cash' && <i className="fas fa-money-bill"></i>}
                          {payment.method === 'bank-transfer' && <i className="fas fa-university"></i>}
                          {payment.method === 'cheque' && <i className="fas fa-money-check"></i>}
                          {payment.method === 'upi' && <i className="fas fa-mobile-alt"></i>}
                          {payment.method === 'online' && <i className="fas fa-credit-card"></i>}
                          {payment.method || 'Not specified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="payment-breakdown">
          <div className="breakdown-card">
            <h3>Payment Distribution</h3>
            <div className="breakdown-content">
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span className="color-dot" style={{backgroundColor: '#3498db'}}></span>
                  Construction Payments
                </div>
                <div className="breakdown-value">
                  ₹{paidConstructionAmount.toLocaleString('en-IN')}
                  <span className="percentage">
                    ({((paidConstructionAmount / totalPaidAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span className="color-dot" style={{backgroundColor: '#e74c3c'}}></span>
                  Expense Payments
                </div>
                <div className="breakdown-value">
                  ₹{paidExpensesAmount.toLocaleString('en-IN')}
                  <span className="percentage">
                    ({((paidExpensesAmount / totalPaidAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;