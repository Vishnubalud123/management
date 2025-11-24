import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, CheckCircle, Clock, AlertCircle, CreditCard, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { toast } from 'react-toastify';

const EditableCard = ({
  data,
  onSave,
  onDelete,
  type = 'stage', // 'stage' or 'expense'
  currency = '₹'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(data.id, formData);
    setIsEditing(false);
    toast.success('Data Saved Successfully');
  };

  const handleCancel = () => {
    setFormData({ ...data });
    setIsEditing(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (amount > 0) {
      const newPaid = Number(data.paid) + amount;
      onSave(data.id, { ...data, paid: newPaid });
      setShowPaymentModal(false);
      setPaymentAmount('');
      toast.success('Payment Added Successfully');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'paid': return 'var(--success)';
      case 'in-progress': return 'var(--warning)';
      case 'pending': return 'var(--text-light)';
      default: return 'var(--text-light)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'paid': return <CheckCircle size={16} />;
      case 'in-progress': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const progress = (data.paid / data.amount) * 100;

  return (
    <>
      <motion.div
        className="card editable-card"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          minWidth: '300px',
          maxWidth: '350px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTop: `4px solid ${getStatusColor(data.status)}`
        }}
      >
        {isEditing ? (
          <div className="edit-mode">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            {type === 'stage' && (
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled
                >
                  <option value="pending">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <small style={{ fontSize: '0.7rem', opacity: 0.7 }}>Status updates automatically based on payment.</small>
              </div>
            )}

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={handleSave} className="btn btn-success" style={{ flex: 1 }}>
                <Save size={16} /> Save
              </button>
              <button onClick={handleCancel} className="btn btn-secondary" style={{ flex: 1 }}>
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>{data.name}</h3>
              <span className="status-badge" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: getStatusColor(data.status),
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {getStatusIcon(data.status)}
                {data.status.replace('-', ' ')}
              </span>
            </div>

            <div className="card-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', opacity: 0.7, marginBottom: '15px', minHeight: '40px' }}>
                {data.notes || 'No description provided.'}
              </p>

              <div className="financials" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Total</label>
                  <div style={{ fontWeight: 'bold' }}>{currency}{parseInt(data.amount).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Paid</label>
                  <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{currency}{parseInt(data.paid).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Balance</label>
                  <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                    {currency}{(data.amount - data.paid).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <ProgressBar progress={progress} color={getStatusColor(data.status)} />
            </div>

            <div className="card-footer" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowPaymentModal(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <CreditCard size={16} /> Add Payment
              </button>
              <div style={{ display: 'flex', gap: '5px' }}>
                {!isEditing && onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
                        onDelete(data.id);
                        toast.success(`${type === 'stage' ? 'Stage' : 'Expense'} Deleted Successfully`);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: 'none' }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2000
            }}
          >
            <motion.div
              className="modal-content card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '90%', maxWidth: '400px', background: 'var(--card-bg-light)', color: 'var(--text-dark)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Add Payment for {data.name}</h3>
                <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Total Amount:</span>
                  <strong>{currency}{data.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Already Paid:</span>
                  <strong style={{ color: 'var(--success)' }}>{currency}{data.paid.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                  <span>Remaining Balance:</span>
                  <strong style={{ color: 'var(--danger)' }}>{currency}{(data.amount - data.paid).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Enter Amount to Pay</label>
                  <input
                    type="number"
                    className="form-control"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={data.amount - data.paid}
                    min="1"
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Confirm Payment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditableCard;
