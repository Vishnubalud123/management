import React from 'react';
import '../../styles/components.css';

const ClientCard = ({ client, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#27ae60';
      case 'completed':
        return '#3498db';
      case 'planning':
        return '#f39c12';
      case 'on hold':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getProjectTypeIcon = (type) => {
    const icons = {
      'Residential House': 'home',
      'Commercial Building': 'building',
      'Villa Construction': 'house-user',
      'Apartment Complex': 'building',
      'Renovation': 'paint-roller',
      'Extension': 'expand',
      'Industrial Building': 'industry',
      'Other': 'tools'
    };
    return icons[type] || 'tools';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(client);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(client.id);
  };

  const handleView = (e) => {
    e.stopPropagation();
    alert(`Viewing details for ${client.name}`);
  };

  return (
    <div className="client-card">
      <div className="client-header">
        <div className="client-info">
          <h3 className="client-name">{client.name}</h3>
          <div className="client-contact">
            <div className="client-contact-item">
              <i className="fas fa-phone"></i>
              <span>{client.phone}</span>
            </div>
            <div className="client-contact-item">
              <i className="fas fa-envelope"></i>
              <span>{client.email}</span>
            </div>
          </div>
        </div>
        <div 
          className={`client-status ${getStatusClass(client.status)}`}
          style={{ backgroundColor: getStatusColor(client.status) }}
        >
          {client.status}
        </div>
      </div>

      <div className="client-details">
        <div className="client-detail-item">
          <span className="client-detail-label">Address:</span>
          <span className="client-detail-value">{client.address}</span>
        </div>
        <div className="client-detail-item">
          <span className="client-detail-label">Project Type:</span>
          <span className="client-detail-value">
            <i className={`fas fa-${getProjectTypeIcon(client.projectType)}`}></i>
            {client.projectType}
          </span>
        </div>
        <div className="client-detail-item">
          <span className="client-detail-label">Budget:</span>
          <span className="client-detail-value">{client.budget}</span>
        </div>
        {client.projectArea && (
          <div className="client-detail-item">
            <span className="client-detail-label">Area:</span>
            <span className="client-detail-value">{client.projectArea} Sqft</span>
          </div>
        )}
        <div className="client-detail-item">
          <span className="client-detail-label">Join Date:</span>
          <span className="client-detail-value">{client.joinDate}</span>
        </div>
      </div>

      <div className="client-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={handleEdit}
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleView}
        >
          <i className="fas fa-eye"></i> View
        </button>
      </div>
    </div>
  );
};

export default ClientCard;