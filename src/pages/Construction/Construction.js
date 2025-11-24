import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConstruction } from '../../context/ConstructionContext';
import EditableCard from '../../components/EditableCard';
import { PlusCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Construction = () => {
  const { stages, updateStage, addStage, deleteStage, projectData } = useConstruction();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStage, setNewStage] = useState({
    name: '',
    percentage: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSaveStage = (id, updatedData) => {
    const processedData = {
      ...updatedData,
      paid: Number(updatedData.paid)
    };
    updateStage(id, processedData);
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStage.name || !newStage.percentage) {
      toast.error('Please fill in all required fields');
      return;
    }

    addStage({
      ...newStage,
      percentage: Number(newStage.percentage)
    });

    setShowAddModal(false);
    setNewStage({
      name: '',
      percentage: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    toast.success('✅ New Stage Added Successfully');
  };

  const calculateAmount = (percent) => {
    if (!percent) return 0;
    return Math.round((projectData.totalCost * Number(percent)) / 100);
  };

  return (
    <div className="construction-page" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/construction-site-bg.jpg')`,
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
            style={{ margin: 0, color: 'var(--primary)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Construction Stages
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <PlusCircle size={20} /> Add Stage
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
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EditableCard
                data={stage}
                onSave={handleSaveStage}
                onDelete={deleteStage}
                type="stage"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Stage Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
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
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              style={{
                background: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Add New Stage</h2>

              <form onSubmit={handleAddStage} style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8 }}>Stage Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStage.name}
                    onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                    placeholder="e.g. Interior Work"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8 }}>Percentage (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newStage.percentage}
                      onChange={(e) => setNewStage({ ...newStage, percentage: e.target.value })}
                      placeholder="0"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8 }}>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newStage.date}
                      onChange={(e) => setNewStage({ ...newStage, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ opacity: 0.7 }}>Calculated Amount:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                      ₹{calculateAmount(newStage.percentage).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                    Based on {newStage.percentage || 0}% of Total Project Cost
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8 }}>Description</label>
                  <textarea
                    className="form-control"
                    value={newStage.description}
                    onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                    rows="3"
                    placeholder="Stage details..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  Add Stage
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Construction;