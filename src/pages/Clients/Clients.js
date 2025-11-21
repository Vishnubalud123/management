import React, { useState } from 'react';
import ClientCard from '../../components/ClientCard/ClientCard';
import { useConstruction } from '../../context/ConstructionContext';
import '../../styles/pages.css';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useConstruction();

  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    projectType: '',
    budget: '',
    status: 'Active',
    projectArea: ''
  });

  const statusOptions = ['Active', 'Completed', 'Planning', 'On Hold'];
  const projectTypes = [
    'Residential House',
    'Commercial Building',
    'Villa Construction',
    'Apartment Complex',
    'Renovation',
    'Extension',
    'Industrial Building',
    'Other'
  ];

  const handleClientSubmit = (e) => {
    e.preventDefault();
    
    const clientData = {
      name: clientForm.name,
      phone: clientForm.phone,
      email: clientForm.email,
      address: clientForm.address,
      projectType: clientForm.projectType,
      budget: clientForm.budget,
      status: clientForm.status,
      projectArea: clientForm.projectArea
    };

    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData);
    }

    resetClientForm();
    setShowClientForm(false);
  };

  const resetClientForm = () => {
    setClientForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      projectType: '',
      budget: '',
      status: 'Active',
      projectArea: ''
    });
    setEditingClient(null);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      projectType: client.projectType,
      budget: client.budget,
      status: client.status,
      projectArea: client.projectArea || ''
    });
    setShowClientForm(true);
  };

  return (
    <div className="clients-page">
      <div className="container">
        <div className="page-header">
          <h1>Client Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetClientForm();
              setShowClientForm(!showClientForm);
            }}
          >
            <i className="fas fa-plus"></i> 
            {showClientForm ? 'Cancel' : 'Add Client'}
          </button>
        </div>

        {showClientForm && (
          <div className="card client-form-card">
            <h3>{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
            <form onSubmit={handleClientSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({...clientForm, status: e.target.value})}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  placeholder="Enter client address"
                  rows="2"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    value={clientForm.projectType}
                    onChange={(e) => setClientForm({...clientForm, projectType: e.target.value})}
                    required
                  >
                    <option value="">Select Project Type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="text"
                    value={clientForm.budget}
                    onChange={(e) => setClientForm({...clientForm, budget: e.target.value})}
                    placeholder="e.g., ₹25,00,000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Area (Sqft)</label>
                  <input
                    type="number"
                    value={clientForm.projectArea}
                    onChange={(e) => setClientForm({...clientForm, projectArea: e.target.value})}
                    placeholder="Enter area in square feet"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save"></i> 
                  {editingClient ? 'Update Client' : 'Save Client'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetClientForm}
                >
                  <i className="fas fa-undo"></i> Reset
                </button>
                {editingClient && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel editing?')) {
                        resetClientForm();
                        setShowClientForm(false);
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

        <div className="clients-stats">
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{clients.length}</span>
              <span className="stat-label">Total Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {clients.filter(c => c.status === 'Active').length}
              </span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {clients.filter(c => c.status === 'Completed').length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        <div className="clients-grid">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => handleEditClient(client)}
              onDelete={() => {
                if (window.confirm(`Are you sure you want to delete "${client.name}"?`)) {
                  deleteClient(client.id);
                }
              }}
            />
          ))}
        </div>

        {clients.length === 0 && !showClientForm && (
          <div className="card empty-state">
            <div className="empty-content">
              <i className="fas fa-users"></i>
              <h3>No Clients Added</h3>
              <p>Click "Add Client" to add your first client</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;