import React, { useState, useEffect } from 'react';
import StageCard from '../../components/StageCard/StageCard';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { useConstruction } from '../../context/ConstructionContext';
import '../../styles/pages.css';

const Construction = () => {
  const {
    projectData,
    stages,
    totalConstructionCost,
    paidConstructionAmount,
    balanceConstructionAmount,
    overallProgress,
    calculateStageAmount,
    addStage,
    updateStage,
    deleteStage,
    addPayment
  } = useConstruction();

  const [showStageForm, setShowStageForm] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const [stageForm, setStageForm] = useState({
    name: '',
    percentage: '',
    amount: '',
    paid: '',
    date: '',
    notes: ''
  });

  // Auto-calculate amount when percentage changes
  useEffect(() => {
    if (stageForm.percentage && !editingStage) {
      const calculatedAmount = calculateStageAmount(parseInt(stageForm.percentage));
      setStageForm(prev => ({
        ...prev,
        amount: calculatedAmount.toString()
      }));
    }
  }, [stageForm.percentage, calculateStageAmount, editingStage]);

  const handleStageSubmit = (e) => {
    e.preventDefault();
    
    const stageData = {
      name: stageForm.name,
      percentage: parseInt(stageForm.percentage),
      amount: parseInt(stageForm.amount),
      paid: parseInt(stageForm.paid) || 0,
      date: stageForm.date,
      notes: stageForm.notes
    };

    if (editingStage) {
      updateStage(editingStage.id, stageData);
    } else {
      addStage(stageData);
    }

    resetStageForm();
    setShowStageForm(false);
  };

  const resetStageForm = () => {
    setStageForm({
      name: '',
      percentage: '',
      amount: '',
      paid: '',
      date: '',
      notes: ''
    });
    setEditingStage(null);
  };

  const handleEditStage = (stage) => {
    setEditingStage(stage);
    setStageForm({
      name: stage.name,
      percentage: stage.percentage.toString(),
      amount: stage.amount.toString(),
      paid: stage.paid.toString(),
      date: stage.date,
      notes: stage.notes || ''
    });
    setShowStageForm(true);
  };

  const handleAddPayment = (stage) => {
    setSelectedStage(stage);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (paymentData) => {
    addPayment({
      ...paymentData,
      type: 'construction',
      itemId: selectedStage.id
    });
    setShowPaymentModal(false);
  };

  const currentStatus = stages.find(stage => stage.status === 'in-progress') || 
                       stages.find(stage => stage.status === 'completed');

  return (
    <div className="construction-page">
      <div className="container">
        <div className="page-header">
          <h1>Construction Progress</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetStageForm();
              setShowStageForm(!showStageForm);
            }}
          >
            <i className="fas fa-plus"></i> 
            {showStageForm ? 'Cancel' : 'Add Stage'}
          </button>
        </div>

        {showStageForm && (
          <div className="card stage-form-card">
            <h3>{editingStage ? 'Edit Stage' : 'Add New Stage'}</h3>
            <form onSubmit={handleStageSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Stage Name</label>
                  <input
                    type="text"
                    value={stageForm.name}
                    onChange={(e) => setStageForm({...stageForm, name: e.target.value})}
                    placeholder="Enter stage name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Percentage (%)</label>
                  <input
                    type="number"
                    value={stageForm.percentage}
                    onChange={(e) => setStageForm({...stageForm, percentage: e.target.value})}
                    placeholder="Enter percentage"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Calculated Amount (₹)</label>
                  <input
                    type="number"
                    value={stageForm.amount}
                    onChange={(e) => setStageForm({...stageForm, amount: e.target.value})}
                    placeholder="Auto-calculated amount"
                    readOnly={!editingStage}
                    required
                  />
                  <small className="form-help">
                    {!editingStage ? 'Automatically calculated from percentage' : 'You can edit this amount'}
                  </small>
                </div>
                <div className="form-group">
                  <label>Already Paid (₹)</label>
                  <input
                    type="number"
                    value={stageForm.paid}
                    onChange={(e) => setStageForm({...stageForm, paid: e.target.value})}
                    placeholder="Enter paid amount"
                    min="0"
                    max={stageForm.amount}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={stageForm.date}
                    onChange={(e) => setStageForm({...stageForm, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={stageForm.notes}
                  onChange={(e) => setStageForm({...stageForm, notes: e.target.value})}
                  placeholder="Add any notes about this stage"
                  rows="3"
                />
              </div>
              
              <div className="form-summary">
                <div className="summary-item">
                  <span>Balance Amount:</span>
                  <span>₹{(parseInt(stageForm.amount) - parseInt(stageForm.paid || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save"></i> 
                  {editingStage ? 'Update Stage' : 'Save Stage'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetStageForm}
                >
                  <i className="fas fa-undo"></i> Reset
                </button>
                {editingStage && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel editing?')) {
                        resetStageForm();
                        setShowStageForm(false);
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
            <h3>Total Construction Cost</h3>
            <div className="value">₹{totalConstructionCost.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card paid">
            <i className="fas fa-check-circle"></i>
            <h3>Paid Amount</h3>
            <div className="value">₹{paidConstructionAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="summary-card balance">
            <i className="fas fa-clock"></i>
            <h3>Balance Amount</h3>
            <div className="value">₹{balanceConstructionAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="progress-container card">
          <div className="progress-info">
            <div>
              <h3>Overall Progress</h3>
              <p>{overallProgress}% completed</p>
            </div>
            <div>
              <h3>Current Status</h3>
              <p>{currentStatus ? `${currentStatus.name} - ${currentStatus.status}` : 'Not Started'}</p>
            </div>
            <div>
              <h3>Last Updated</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${overallProgress}%`}}
            ></div>
          </div>
        </div>

        <div className="stages-grid">
          {stages.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              onEdit={() => handleEditStage(stage)}
              onDelete={() => {
                if (window.confirm(`Are you sure you want to delete "${stage.name}"?`)) {
                  deleteStage(stage.id);
                }
              }}
              onAddPayment={() => handleAddPayment(stage)}
            />
          ))}
        </div>

        {stages.length === 0 && (
          <div className="card empty-state">
            <div className="empty-content">
              <i className="fas fa-tasks"></i>
              <h3>No Construction Stages</h3>
              <p>Click "Add Stage" to create your first construction stage</p>
            </div>
          </div>
        )}

        {showPaymentModal && selectedStage && (
          <PaymentModal
            item={selectedStage}
            type="construction"
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handlePaymentSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Construction;