
import { PROJECT_DATA, EXPENSE_CATEGORIES, CLIENT_STATUS } from './constants';

// Date Utilities
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Not set';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInFuture = (dateString) => {
  return new Date(dateString) > new Date();
};

// Number Formatting
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

export const parseCurrency = (currencyString) => {
  return parseInt(currencyString.replace(/[^\d]/g, '')) || 0;
};

// String Utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Validation Helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Category and Status Helpers
export const getCategoryInfo = (category) => {
  return EXPENSE_CATEGORIES.find(cat => cat.value === category) || 
         { value: category, label: capitalize(category), icon: 'fas fa-receipt' };
};

export const getStatusInfo = (status) => {
  return CLIENT_STATUS.find(s => s.value === status) || 
         { value: status, label: status, color: '#95a5a6' };
};

export const getStageStatus = (paid, total) => {
  if (paid === 0) return 'pending';
  if (paid >= total) return 'completed';
  return 'in-progress';
};

// Calculation Helpers
export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export const calculateStageAmount = (percentage) => {
  return Math.round((percentage / 100) * PROJECT_DATA.totalCost);
};

export const calculateBalance = (total, paid) => {
  return Math.max(0, total - paid);
};

// Array Utilities
export const sortByDate = (array, dateField = 'date', ascending = false) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortByNumber = (array, numberField, ascending = true) => {
  return [...array].sort((a, b) => {
    return ascending ? a[numberField] - b[numberField] : b[numberField] - a[numberField];
  });
};

export const filterByStatus = (array, status) => {
  return array.filter(item => item.status === status);
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

// File Utilities
export const downloadFile = (content, fileName, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Local Storage Helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
};

// Export Helpers
export const prepareExportData = (data, type) => {
  const metadata = {
    exportedAt: new Date().toISOString(),
    type: type,
    version: '1.0',
    totalRecords: data.length
  };

  return {
    metadata,
    data
  };
};

// Notification Helper
export const showNotification = (message, type = 'info') => {
  // This would integrate with a notification system
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // For now, we'll use browser alert as fallback
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else if (type === 'success') {
    alert(`Success: ${message}`);
  }
};

// Debounce Helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle Helper
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};