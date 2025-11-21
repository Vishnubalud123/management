import { PROJECT_TYPES, EXPENSE_CATEGORIES } from './constants';

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  aadhaar: /^\d{12}$/
};

// Stage Validators
export const validateStage = (stageData) => {
  const errors = {};

  if (!stageData.name?.trim()) {
    errors.name = 'Stage name is required';
  } else if (stageData.name.length < 3) {
    errors.name = 'Stage name must be at least 3 characters';
  }

  if (!stageData.percentage || stageData.percentage < 1 || stageData.percentage > 100) {
    errors.percentage = 'Percentage must be between 1 and 100';
  }

  if (!stageData.amount || stageData.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (stageData.date && new Date(stageData.date) > new Date()) {
    errors.date = 'Start date cannot be in the future';
  }

  return errors;
};

// Expense Validators
export const validateExpense = (expenseData) => {
  const errors = {};

  if (!expenseData.name?.trim()) {
    errors.name = 'Expense name is required';
  }

  if (!expenseData.amount || expenseData.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!expenseData.date) {
    errors.date = 'Date is required';
  } else if (new Date(expenseData.date) > new Date()) {
    errors.date = 'Date cannot be in the future';
  }

  if (!expenseData.category) {
    errors.category = 'Category is required';
  } else if (!EXPENSE_CATEGORIES.find(cat => cat.value === expenseData.category)) {
    errors.category = 'Invalid category selected';
  }

  return errors;
};

// Client Validators
export const validateClient = (clientData) => {
  const errors = {};

  if (!clientData.name?.trim()) {
    errors.name = 'Client name is required';
  } else if (clientData.name.length < 2) {
    errors.name = 'Client name must be at least 2 characters';
  }

  if (!clientData.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validationPatterns.phone.test(clientData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid Indian phone number';
  }

  if (!clientData.email) {
    errors.email = 'Email is required';
  } else if (!validationPatterns.email.test(clientData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!clientData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!clientData.projectType) {
    errors.projectType = 'Project type is required';
  } else if (!PROJECT_TYPES.includes(clientData.projectType)) {
    errors.projectType = 'Please select a valid project type';
  }

  if (!clientData.budget?.trim()) {
    errors.budget = 'Budget is required';
  }

  if (!clientData.status) {
    errors.status = 'Status is required';
  }

  return errors;
};

// Payment Validators
export const validatePayment = (paymentData, item) => {
  const errors = {};
  const balance = item.amount - item.paid;

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = 'Payment amount must be greater than 0';
  } else if (paymentData.amount > balance) {
    errors.amount = `Payment amount cannot exceed balance of ${balance}`;
  }

  if (!paymentData.date) {
    errors.date = 'Payment date is required';
  } else if (new Date(paymentData.date) > new Date()) {
    errors.date = 'Payment date cannot be in the future';
  }

  if (!paymentData.description?.trim()) {
    errors.description = 'Payment description is required';
  }

  return errors;
};

// Project Validators
export const validateProject = (projectData) => {
  const errors = {};

  if (!projectData.projectName?.trim()) {
    errors.projectName = 'Project name is required';
  }

  if (!projectData.engineer?.trim()) {
    errors.engineer = 'Engineer name is required';
  }

  if (!projectData.perSqftRate || projectData.perSqftRate <= 0) {
    errors.perSqftRate = 'Rate per sqft must be greater than 0';
  }

  if (!projectData.totalSqft || projectData.totalSqft <= 0) {
    errors.totalSqft = 'Total area must be greater than 0';
  }

  if (!projectData.location?.trim()) {
    errors.location = 'Location is required';
  }

  return errors;
};

// Form Field Validators
export const validateRequired = (value, fieldName) => {
  if (!value?.toString().trim()) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!validationPatterns.email.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const cleanPhone = phone.replace(/\D/g, '');
  if (!validationPatterns.phone.test(cleanPhone)) {
    return 'Please enter a valid 10-digit Indian phone number';
  }
  return '';
};

export const validateNumber = (value, fieldName, min = 0, max = Infinity) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be at most ${max}`;
  return '';
};

export const validateDate = (dateString, fieldName, allowFuture = false) => {
  if (!dateString) return `${fieldName} is required`;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return `Invalid ${fieldName}`;
  if (!allowFuture && date > new Date()) return `${fieldName} cannot be in the future`;
  return '';
};

// Bulk Validation
export const validateForm = (data, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rule = validationRules[field];
    const value = data[field];
    let error = '';

    if (rule.required && !value?.toString().trim()) {
      error = rule.required;
    } else if (rule.validate && value) {
      error = rule.validate(value);
    }

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Example validation rules object structure
export const stageValidationRules = {
  name: {
    required: 'Stage name is required',
    validate: (value) => value.length < 3 ? 'Stage name must be at least 3 characters' : ''
  },
  percentage: {
    required: 'Percentage is required',
    validate: (value) => {
      const num = Number(value);
      if (isNaN(num)) return 'Percentage must be a number';
      if (num < 1 || num > 100) return 'Percentage must be between 1 and 100';
      return '';
    }
  },
  amount: {
    required: 'Amount is required',
    validate: (value) => {
      const num = Number(value);
      if (isNaN(num)) return 'Amount must be a number';
      if (num <= 0) return 'Amount must be greater than 0';
      return '';
    }
  }
};

export default {
  validateStage,
  validateExpense,
  validateClient,
  validatePayment,
  validateProject,
  validateRequired,
  validateEmail,
  validatePhone,
  validateNumber,
  validateDate,
  validateForm,
  validationPatterns
};