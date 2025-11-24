import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConstruction } from '../../context/ConstructionContext';
import EditableCard from '../../components/EditableCard';
import { Plus, X, Wallet } from 'lucide-react';

const Expenses = () => {
  const { expenses, updateExpense, addExpense, deleteExpense } = useConstruction();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    paid: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'pending'
  });

  const handleSaveExpense = (id, updatedData) => {
    const processedData = {
      ...updatedData,
      paid: Number(updatedData.paid),
      amount: Number(updatedData.amount)
    };
    updateExpense(id, processedData);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addExpense({
      ...newExpense,
      amount: Number(newExpense.amount),
      paid: Number(newExpense.paid)
    });
    setShowAddModal(false);
    setNewExpense({
      name: '',
      amount: '',
      paid: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'pending'
    });
  };

  return (
    <div className="expenses-page" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/images/tools-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: 'calc(100vh - 80px)',
      padding: '2rem 0',
      color: 'white',
      overflowX: 'hidden'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ color: 'var(--primary)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Expenses
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} /> Add Expense
          </motion.button>
        </div>

        <div className="horizontal-scroll-container" style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '20px 5px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}>
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EditableCard
                data={expense}
                onSave={handleSaveExpense}
                onDelete={deleteExpense}
                type="expense"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{
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
        }}>
          <motion.div
            className="modal-content card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ width: '90%', maxWidth: '500px', background: 'var(--card-bg-light)', color: 'var(--text-dark)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Add New Expense</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Expense Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Total Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Initial Paid Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newExpense.paid}
                  onChange={(e) => setNewExpense({ ...newExpense, paid: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Wallet size={20} /> Add Expense
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Expenses;