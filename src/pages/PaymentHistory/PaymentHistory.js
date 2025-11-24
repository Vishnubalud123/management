import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConstruction } from '../../context/ConstructionContext';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Edit, PlusCircle, X, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
  const { getAllPayments, totalPaid, totalProjectCost, totalBalance, overallProgress, addManualPayment, updatePayment, deletePayment } = useConstruction();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Form states
  const [newPayment, setNewPayment] = useState({
    itemName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const payments = getAllPayments();

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.type === filter || (filter === 'other' && payment.type === 'other');
    const matchesSearch = (payment.itemName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addManualPayment({
      itemName: newPayment.itemName,
      amount: Number(newPayment.amount),
      date: newPayment.date,
      notes: newPayment.notes,
      totalPaid: totalPaid + Number(newPayment.amount), // Approximate update
      balance: 0 // Manual payments might not have balance tracking
    });
    setShowAddModal(false);
    setNewPayment({
      itemName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    toast.success('✅ Payment Added Successfully');
  };

  const handleEditClick = (payment) => {
    setEditingPayment({ ...payment });
    setShowEditModal(true);
  };

  const handleDeleteClick = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deletePayment(paymentId);
      toast.success('🗑️ Payment deleted successfully.');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updatePayment(editingPayment.id, {
      amount: Number(editingPayment.amount),
      date: editingPayment.date,
      notes: editingPayment.notes
    });
    setShowEditModal(false);
    setEditingPayment(null);
    toast.success('Payment updated successfully');
  };

  return (
    <div className="payment-history-page" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/images/finance-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: 'calc(100vh - 80px)',
      padding: '2rem 0',
      color: 'white'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ margin: 0, color: 'var(--primary)' }}
          >
            Payment History
          </motion.h1>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} /> Add Other Payment
          </button>
        </div>

        <div className="summary-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <motion.div className="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ background: 'var(--card-bg-dark)', color: 'white' }}>
            <label style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Project Cost</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalProjectCost.toLocaleString('en-IN')}</div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ background: 'var(--card-bg-dark)', color: 'white' }}>
            <label style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Paid</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{totalPaid.toLocaleString('en-IN')}</div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ background: 'var(--card-bg-dark)', color: 'white' }}>
            <label style={{ opacity: 0.7, fontSize: '0.9rem' }}>Balance Due</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>₹{totalBalance.toLocaleString('en-IN')}</div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} style={{ background: 'var(--card-bg-dark)', color: 'white' }}>
            <label style={{ opacity: 0.7, fontSize: '0.9rem' }}>Progress</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{Math.round(overallProgress)}%</div>
          </motion.div>
        </div>

        <div className="filters-bar" style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          background: 'rgba(34, 40, 49, 0.8)',
          padding: '15px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '5px',
                color: 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Filter size={18} style={{ opacity: 0.7 }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Transactions</option>
              <option value="construction">Construction</option>
              <option value="expense">Expenses</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="transactions-list" style={{ display: 'grid', gap: '15px' }}>
          <AnimatePresence>
            {filteredPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.05 }}
                className="transaction-card"
                style={{
                  background: 'rgba(34, 40, 49, 0.9)',
                  padding: '20px',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${payment.type === 'construction' ? 'var(--primary)' : payment.type === 'expense' ? 'var(--danger)' : 'var(--accent)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    {payment.type === 'construction' ? <ArrowUpRight size={18} color="var(--primary)" /> :
                      payment.type === 'expense' ? <ArrowDownLeft size={18} color="var(--danger)" /> :
                        <ArrowUpRight size={18} color="var(--accent)" />}
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{payment.itemName}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', opacity: 0.7 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {new Date(payment.date).toLocaleDateString('en-IN')}
                    </span>
                    <span>{payment.notes}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: payment.type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    ₹{Number(payment.amount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="btn-icon"
                      style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer' }}
                      title="Edit Payment"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(payment.id)}
                      className="btn-icon"
                      style={{ background: 'rgba(220, 53, 69, 0.2)', padding: '8px', borderRadius: '5px', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                      title="Delete Payment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPayments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
              No payments found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 1000,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="modal-content"
              style={{
                background: 'var(--card-bg)', padding: '2rem', borderRadius: '15px',
                width: '90%', maxWidth: '500px', border: '1px solid var(--border-color)', position: 'relative'
              }}
            >
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Add Other Payment</h2>
              <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '15px' }}>
                <input type="text" className="form-control" placeholder="Payment Name / Description" value={newPayment.itemName} onChange={e => setNewPayment({ ...newPayment, itemName: e.target.value })} required />
                <input type="number" className="form-control" placeholder="Amount (₹)" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} required />
                <input type="date" className="form-control" value={newPayment.date} onChange={e => setNewPayment({ ...newPayment, date: e.target.value })} required />
                <textarea className="form-control" placeholder="Notes (Optional)" value={newPayment.notes} onChange={e => setNewPayment({ ...newPayment, notes: e.target.value })} rows="3" />
                <button type="submit" className="btn btn-primary">Add Payment</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Payment Modal */}
      <AnimatePresence>
        {showEditModal && editingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 1000,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="modal-content"
              style={{
                background: 'var(--card-bg)', padding: '2rem', borderRadius: '15px',
                width: '90%', maxWidth: '500px', border: '1px solid var(--border-color)', position: 'relative'
              }}
            >
              <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Edit Payment</h2>
              <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '15px' }}>
                <div style={{ opacity: 0.7, marginBottom: '5px' }}>Editing: {editingPayment.itemName}</div>
                <input type="number" className="form-control" placeholder="Amount (₹)" value={editingPayment.amount} onChange={e => setEditingPayment({ ...editingPayment, amount: e.target.value })} required />
                <input type="date" className="form-control" value={editingPayment.date} onChange={e => setEditingPayment({ ...editingPayment, date: e.target.value })} required />
                <textarea className="form-control" placeholder="Notes" value={editingPayment.notes} onChange={e => setEditingPayment({ ...editingPayment, notes: e.target.value })} rows="3" />
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentHistory;