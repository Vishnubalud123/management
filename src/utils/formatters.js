import { formatCurrency, formatDate, formatNumber } from './helpers';

// Stage Formatters
export const formatStageStatus = (status) => {
  const statusMap = {
    'pending': { text: 'Pending', color: '#95a5a6', icon: 'clock' },
    'in-progress': { text: 'In Progress', color: '#f39c12', icon: 'tools' },
    'completed': { text: 'Completed', color: '#27ae60', icon: 'check-circle' }
  };
  return statusMap[status] || { text: status, color: '#95a5a6', icon: 'question' };
};

export const formatStageProgress = (stage) => {
  const percentage = stage.amount > 0 ? Math.round((stage.paid / stage.amount) * 100) : 0;
  return {
    percentage,
    text: `${percentage}% Paid`,
    color: percentage === 100 ? '#27ae60' : percentage > 0 ? '#f39c12' : '#95a5a6'
  };
};

// Expense Formatters
export const formatExpenseCategory = (category) => {
  const categoryMap = {
    'borewell': { text: 'Borewell', icon: 'water', color: '#3498db' },
    'sump': { text: 'Sump', icon: 'tint', color: '#2980b9' },
    'septic-tank': { text: 'Septic Tank', icon: 'recycle', color: '#16a085' },
    'electrical': { text: 'Electrical', icon: 'bolt', color: '#f39c12' },
    'plumbing': { text: 'Plumbing', icon: 'wrench', color: '#8e44ad' },
    'material': { text: 'Material', icon: 'box', color: '#d35400' },
    'labor': { text: 'Labor', icon: 'hard-hat', color: '#c0392b' },
    'permit': { text: 'Permit', icon: 'file-contract', color: '#7f8c8d' },
    'transport': { text: 'Transport', icon: 'truck', color: '#27ae60' },
    'other': { text: 'Other', icon: 'receipt', color: '#95a5a6' }
  };
  return categoryMap[category] || { text: category, icon: 'receipt', color: '#95a5a6' };
};

export const formatExpenseStatus = (status) => {
  const statusMap = {
    'pending': { text: 'Pending', color: '#f39c12', icon: 'clock' },
    'paid': { text: 'Paid', color: '#27ae60', icon: 'check-circle' }
  };
  return statusMap[status] || { text: status, color: '#95a5a6', icon: 'question' };
};

// Client Formatters
export const formatClientStatus = (status) => {
  const statusMap = {
    'Planning': { text: 'Planning', color: '#f39c12', icon: 'clipboard-list' },
    'Active': { text: 'Active', color: '#27ae60', icon: 'hard-hat' },
    'On Hold': { text: 'On Hold', color: '#e74c3c', icon: 'pause-circle' },
    'Completed': { text: 'Completed', color: '#3498db', icon: 'check-double' }
  };
  return statusMap[status] || { text: status, color: '#95a5a6', icon: 'question' };
};

export const formatProjectType = (type) => {
  const typeMap = {
    'Residential House': { icon: 'home', color: '#27ae60' },
    'Commercial Building': { icon: 'building', color: '#3498db' },
    'Villa Construction': { icon: 'house-user', color: '#9b59b6' },
    'Apartment Complex': { icon: 'building', color: '#e67e22' },
    'Renovation': { icon: 'paint-roller', color: '#e74c3c' },
    'Extension': { icon: 'expand', color: '#f39c12' },
    'Industrial Building': { icon: 'industry', color: '#34495e' },
    'Other': { icon: 'tools', color: '#95a5a6' }
  };
  return typeMap[type] || { icon: 'tools', color: '#95a5a6' };
};

// Payment Formatters
export const formatPaymentMethod = (method) => {
  const methodMap = {
    'cash': { text: 'Cash', icon: 'money-bill', color: '#27ae60' },
    'bank-transfer': { text: 'Bank Transfer', icon: 'university', color: '#3498db' },
    'cheque': { text: 'Cheque', icon: 'money-check', color: '#9b59b6' },
    'upi': { text: 'UPI', icon: 'mobile-alt', color: '#e67e22' },
    'online': { text: 'Online', icon: 'credit-card', color: '#e74c3c' }
  };
  return methodMap[method] || { text: method, icon: 'money-bill', color: '#95a5a6' };
};

// Financial Formatters
export const formatFinancialSummary = (stages, expenses) => {
  const totalConstruction = stages.reduce((sum, stage) => sum + stage.amount, 0);
  const paidConstruction = stages.reduce((sum, stage) => sum + stage.paid, 0);
  const balanceConstruction = totalConstruction - paidConstruction;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.reduce((sum, expense) => sum + expense.paid, 0);
  const balanceExpenses = totalExpenses - paidExpenses;
  
  const grandTotal = totalConstruction + totalExpenses;
  const totalPaid = paidConstruction + paidExpenses;
  const totalBalance = balanceConstruction + balanceExpenses;

  return {
    construction: {
      total: totalConstruction,
      paid: paidConstruction,
      balance: balanceConstruction,
      progress: Math.round((paidConstruction / totalConstruction) * 100) || 0
    },
    expenses: {
      total: totalExpenses,
      paid: paidExpenses,
      balance: balanceExpenses,
      progress: Math.round((paidExpenses / totalExpenses) * 100) || 0
    },
    overall: {
      total: grandTotal,
      paid: totalPaid,
      balance: totalBalance,
      progress: Math.round((totalPaid / grandTotal) * 100) || 0
    }
  };
};

// Timeline Formatters
export const formatTimelineData = (stages) => {
  const completedStages = stages.filter(stage => stage.status === 'completed');
  const inProgressStages = stages.filter(stage => stage.status === 'in-progress');
  const pendingStages = stages.filter(stage => stage.status === 'pending');

  return {
    completed: completedStages.length,
    inProgress: inProgressStages.length,
    pending: pendingStages.length,
    total: stages.length,
    completionRate: Math.round((completedStages.length / stages.length) * 100) || 0
  };
};

// Chart Data Formatters
export const formatStageChartData = (stages) => {
  return stages.map(stage => ({
    name: stage.name,
    planned: stage.amount,
    actual: stage.paid,
    progress: Math.round((stage.paid / stage.amount) * 100) || 0,
    status: stage.status
  }));
};

export const formatExpenseChartData = (expenses) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = formatExpenseCategory(expense.category).text;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

// Export Data Formatters
export const formatDataForExport = (data, type) => {
  switch (type) {
    case 'stages':
      return data.map(stage => ({
        'Stage Name': stage.name,
        'Percentage': `${stage.percentage}%`,
        'Total Amount': formatCurrency(stage.amount),
        'Paid Amount': formatCurrency(stage.paid),
        'Balance Amount': formatCurrency(stage.amount - stage.paid),
        'Status': formatStageStatus(stage.status).text,
        'Start Date': stage.date ? formatDate(stage.date) : 'Not Started',
        'Notes': stage.notes || ''
      }));

    case 'expenses':
      return data.map(expense => ({
        'Expense Name': expense.name,
        'Category': formatExpenseCategory(expense.category).text,
        'Total Amount': formatCurrency(expense.amount),
        'Paid Amount': formatCurrency(expense.paid),
        'Balance Amount': formatCurrency(expense.amount - expense.paid),
        'Status': formatExpenseStatus(expense.status).text,
        'Date': formatDate(expense.date),
        'Vendor': expense.vendor || '',
        'Notes': expense.notes || ''
      }));

    case 'clients':
      return data.map(client => ({
        'Client Name': client.name,
        'Phone': client.phone,
        'Email': client.email,
        'Address': client.address,
        'Project Type': client.projectType,
        'Budget': client.budget,
        'Status': client.status,
        'Join Date': formatDate(client.joinDate),
        'Project Area': client.projectArea || ''
      }));

    default:
      return data;
  }
};

// Notification Formatters
export const formatNotification = (type, data) => {
  const notifications = {
    'stage-completed': {
      title: 'Stage Completed!',
      message: `"${data.stageName}" has been completed successfully.`,
      type: 'success'
    },
    'payment-received': {
      title: 'Payment Received',
      message: `Received ${formatCurrency(data.amount)} for ${data.itemName}.`,
      type: 'success'
    },
    'stage-started': {
      title: 'Stage Started',
      message: `"${data.stageName}" has been started.`,
      type: 'info'
    },
    'balance-due': {
      title: 'Balance Due',
      message: `Balance of ${formatCurrency(data.balance)} is due for ${data.itemName}.`,
      type: 'warning'
    }
  };

  return notifications[type] || {
    title: 'Notification',
    message: 'An event has occurred.',
    type: 'info'
  };
};

export default {
  formatStageStatus,
  formatStageProgress,
  formatExpenseCategory,
  formatExpenseStatus,
  formatClientStatus,
  formatProjectType,
  formatPaymentMethod,
  formatFinancialSummary,
  formatTimelineData,
  formatStageChartData,
  formatExpenseChartData,
  formatDataForExport,
  formatNotification
};