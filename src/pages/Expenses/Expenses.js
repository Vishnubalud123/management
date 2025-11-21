import React, { useState } from 'react';
import ExpenseCard from '../../components/ExpenseCard/ExpenseCard';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { useConstruction } from '../../context/ConstructionContext';
import '../../styles/pages.css';

const Expenses = () => {
  const {
    expenses,
    totalExpensesAmount,
    paidExpensesAmount,
    balanceExpensesAmount,
    addExpense,
    updateExpense,
    deleteExpense,
    addPayment
  } = useConstruction();

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: '',
    date: '',
    category: 'other',
    notes: '',
    vendor: ''
  });

  const categories = [
    { value: 'borewell', label: 'Borewell' },
    { value: 'sump', label: 'Sump' },
    { value: 'septic-tank', label: 'Septic Tank' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'material', label: 'Material' },
    { value: 'labor', label: 'Labor' },
    { value: 'other', label: 'Other' }
  ];

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    
    const expenseData = {
      name: expenseForm.name,
      amount: parseInt(expenseForm.amount),
      date: expenseForm.date,
      category: expenseForm.category,
      notes: expenseForm.notes,
      vendor: expenseForm.vendor
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    resetExpenseForm();
    setShowExpenseForm(false);
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      name: '',
      amount: '',
      date: '',
      category: 'other',
      notes: '',
      vendor: ''
    });
    setEditingExpense(null);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      name: expense.name,
      amount: expense.amount.toString(),
      date: expense.date,
      category: expense.category,
      notes: expense.notes || '',
      vendor: expense.vendor || ''
    });
    setShowExpenseForm(true);
  };

  const handleAddPayment = (expense) => {
    setSelectedExpense(expense);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (paymentData) => {
    addPayment({
      ...paymentData,
      type: 'expense',
      itemId: selectedExpense.id
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="expenses-page">
      <div className="container">
        <div className="page-header">
          <h1>Other Construction Expenses</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetExpenseForm();
              setShowExpenseForm(!showExpenseForm);
            }}
          >
            <i className="fas fa-plus"></i> 
            {showExpenseForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {showExpenseForm && (
          <div className="card expense-form-card">
            <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
            <form onSubmit={handleExpenseSubmit}>
              <div className="form-group">
                <label>Expense Name</label>
                <input
                  type="text"
                  value={expenseForm.name}
                  onChange={(e) => setExpenseForm({...expenseForm, name: e.target.value})}
                  placeholder="Enter expense name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    placeholder="Enter total amount"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vendor (Optional)</label>
                  <input
                    type="text"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                    placeholder="Enter vendor name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                  placeholder="Add any notes about this expense"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save"></i> 
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetExpenseForm}
                >
                  <i className="fas fa-undo"></i> Reset
                </button>
                {editingExpense && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel editing?')) {
                        resetExpenseForm();
                        setShowExpenseForm(false);
                      }
                    }}
                  >
                    <i className="fas fa-times"></i> Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="payment-summary">
          <div className="summary-card total">
            <i className="fas fa-receipt"></i>
            <h3>Total Expenses</h3>
            <div className="value">₹{totalExpensesAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card paid">
            <i className="fas fa-check-circle"></i>
            <h3>Paid Amount</h3>
            <div className="value">₹{paidExpensesAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card balance">
            <i className="fas fa-clock"></i>
            <h3>Balance Amount</h3>
            <div className="value">₹{balanceExpensesAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="expenses-grid">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => handleEditExpense(expense)}
              onDelete={() => {
                if (window.confirm(`Are you sure you want to delete "${expense.name}"?`)) {
                  deleteExpense(expense.id);
                }
              }}
              onAddPayment={() => handleAddPayment(expense)}
            />
          ))}
        </div>

        {expenses.length === 0 && !showExpenseForm && (
          <div className="card empty-state">
            <div className="empty-content">
              <i className="fas fa-receipt"></i>
              <h3>No Expenses Added</h3>
              <p>Click "Add Expense" to record your first expense</p>
            </div>
          </div>
        )}

        {showPaymentModal && selectedExpense && (
          <PaymentModal
            item={selectedExpense}
            type="expense"
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handlePaymentSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;