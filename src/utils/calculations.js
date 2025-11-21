import { PROJECT_DATA } from './constants';

// Construction Calculations
export const calculateStageAmount = (percentage) => {
  return Math.round((percentage / 100) * PROJECT_DATA.totalCost);
};

export const calculateTotalConstructionCost = (stages) => {
  return stages.reduce((total, stage) => total + stage.amount, 0);
};

export const calculatePaidConstruction = (stages) => {
  return stages.reduce((total, stage) => total + stage.paid, 0);
};

export const calculateConstructionBalance = (stages) => {
  const total = calculateTotalConstructionCost(stages);
  const paid = calculatePaidConstruction(stages);
  return total - paid;
};

export const calculateOverallProgress = (stages) => {
  const completedStages = stages.filter(stage => stage.status === 'completed');
  return completedStages.reduce((total, stage) => total + stage.percentage, 0);
};

export const calculateFinancialProgress = (stages) => {
  const totalCost = calculateTotalConstructionCost(stages);
  const totalPaid = calculatePaidConstruction(stages);
  return totalCost > 0 ? Math.round((totalPaid / totalCost) * 100) : 0;
};

// Expense Calculations
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculatePaidExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.paid, 0);
};

export const calculateExpenseBalance = (expenses) => {
  const total = calculateTotalExpenses(expenses);
  const paid = calculatePaidExpenses(expenses);
  return total - paid;
};

// Project-wide Calculations
export const calculateGrandTotal = (stages, expenses) => {
  return calculateTotalConstructionCost(stages) + calculateTotalExpenses(expenses);
};

export const calculateTotalPaid = (stages, expenses) => {
  return calculatePaidConstruction(stages) + calculatePaidExpenses(expenses);
};

export const calculateTotalBalance = (stages, expenses) => {
  return calculateConstructionBalance(stages) + calculateExpenseBalance(expenses);
};

export const calculateOverallFinancialProgress = (stages, expenses) => {
  const grandTotal = calculateGrandTotal(stages, expenses);
  const totalPaid = calculateTotalPaid(stages, expenses);
  return grandTotal > 0 ? Math.round((totalPaid / grandTotal) * 100) : 0;
};

// Timeline Calculations
export const calculateProjectDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateDaysRemaining = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateStageDuration = (stage) => {
  if (!stage.date || stage.status === 'pending') return 0;
  
  const startDate = new Date(stage.date);
  const endDate = stage.status === 'completed' ? 
    new Date(stage.updatedAt || new Date()) : new Date();
  
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Budget Calculations
export const calculateBudgetUtilization = (actualCost, budget) => {
  const budgetAmount = parseFloat(budget.replace(/[^\d.]/g, '')) || 0;
  return budgetAmount > 0 ? Math.round((actualCost / budgetAmount) * 100) : 0;
};

export const calculateCostVariance = (actualCost, budget) => {
  const budgetAmount = parseFloat(budget.replace(/[^\d.]/g, '')) || 0;
  return actualCost - budgetAmount;
};

// Payment Schedule Calculations
export const calculateNextPayment = (stages) => {
  const pendingStages = stages.filter(stage => 
    stage.status === 'pending' || stage.status === 'in-progress'
  );
  
  if (pendingStages.length === 0) return null;
  
  // Return the next stage that should be paid
  return pendingStages[0];
};

export const calculateUpcomingPayments = (stages, count = 3) => {
  const pendingStages = stages.filter(stage => 
    stage.status === 'pending' || stage.status === 'in-progress'
  );
  
  return pendingStages.slice(0, count).map(stage => ({
    stage: stage.name,
    amount: stage.amount - stage.paid,
    status: stage.status
  }));
};

// Statistical Calculations
export const calculateAveragePayment = (payments) => {
  if (payments.length === 0) return 0;
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return Math.round(total / payments.length);
};

export const calculatePaymentFrequency = (payments, periodInDays = 30) => {
  if (payments.length < 2) return 0;
  
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  const firstDate = new Date(sortedPayments[0].date);
  const lastDate = new Date(sortedPayments[sortedPayments.length - 1].date);
  const totalDays = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24));
  
  return Math.round((payments.length / totalDays) * periodInDays);
};

// Progress Forecasting
export const calculateEstimatedCompletion = (stages, startDate) => {
  const completedStages = stages.filter(stage => stage.status === 'completed');
  const remainingStages = stages.filter(stage => stage.status !== 'completed');
  
  if (remainingStages.length === 0) return new Date();
  
  const avgStageDuration = completedStages.length > 0 ?
    completedStages.reduce((sum, stage) => sum + calculateStageDuration(stage), 0) / completedStages.length :
    30; // Default 30 days per stage
  
  const totalRemainingDays = remainingStages.length * avgStageDuration;
  const completionDate = new Date(startDate);
  completionDate.setDate(completionDate.getDate() + totalRemainingDays);
  
  return completionDate;
};

// Risk Calculations
export const calculateFinancialRisk = (stages, expenses) => {
  const totalBalance = calculateTotalBalance(stages, expenses);
  const grandTotal = calculateGrandTotal(stages, expenses);
  const paidPercentage = calculateOverallFinancialProgress(stages, expenses);
  
  let riskScore = 0;
  
  if (paidPercentage < 20) riskScore += 3;
  else if (paidPercentage < 50) riskScore += 2;
  else if (paidPercentage < 80) riskScore += 1;
  
  const balanceRatio = totalBalance / grandTotal;
  if (balanceRatio > 0.7) riskScore += 3;
  else if (balanceRatio > 0.5) riskScore += 2;
  else if (balanceRatio > 0.3) riskScore += 1;
  
  return Math.min(riskScore, 5); // Scale of 1-5
};

// Utility Calculations
export const calculatePerSqftCost = (totalCost, area) => {
  return area > 0 ? Math.round(totalCost / area) : 0;
};

export const calculateMaterialCost = (expenses) => {
  const materialExpenses = expenses.filter(expense => 
    expense.category === 'material'
  );
  return calculateTotalExpenses(materialExpenses);
};

export const calculateLaborCost = (expenses) => {
  const laborExpenses = expenses.filter(expense => 
    expense.category === 'labor'
  );
  return calculateTotalExpenses(laborExpenses);
};

export const calculateCostDistribution = (stages, expenses) => {
  const constructionCost = calculateTotalConstructionCost(stages);
  const additionalCost = calculateTotalExpenses(expenses);
  const totalCost = constructionCost + additionalCost;
  
  return {
    construction: Math.round((constructionCost / totalCost) * 100),
    additional: Math.round((additionalCost / totalCost) * 100)
  };
};

export default {
  // Construction
  calculateStageAmount,
  calculateTotalConstructionCost,
  calculatePaidConstruction,
  calculateConstructionBalance,
  calculateOverallProgress,
  calculateFinancialProgress,
  
  // Expenses
  calculateTotalExpenses,
  calculatePaidExpenses,
  calculateExpenseBalance,
  
  // Project
  calculateGrandTotal,
  calculateTotalPaid,
  calculateTotalBalance,
  calculateOverallFinancialProgress,
  
  // Timeline
  calculateProjectDuration,
  calculateDaysRemaining,
  calculateStageDuration,
  
  // Budget
  calculateBudgetUtilization,
  calculateCostVariance,
  
  // Payments
  calculateNextPayment,
  calculateUpcomingPayments,
  calculateAveragePayment,
  calculatePaymentFrequency,
  
  // Forecasting
  calculateEstimatedCompletion,
  
  // Risk
  calculateFinancialRisk,
  
  // Utilities
  calculatePerSqftCost,
  calculateMaterialCost,
  calculateLaborCost,
  calculateCostDistribution
};