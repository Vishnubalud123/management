
import jsPDF from 'jspdf';
import { PROJECT_DATA, COMPANY_INFO } from './constants';
import { formatCurrency, formatDate, formatNumber } from './helpers';

class PDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.margin = 20;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = this.margin;
  }

  // Header Section
  addHeader() {
    // Company Logo and Name
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(44, 62, 80); // Primary color
    this.doc.text(COMPANY_INFO.name, this.margin, this.currentY);
    
    // Company Tagline
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Professional Construction Management', this.margin, this.currentY + 7);
    
    // Document Title and Date
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Construction Quotation', this.pageWidth - this.margin - 60, this.currentY);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Generated: ${formatDate(new Date())}`, this.pageWidth - this.margin - 60, this.currentY + 6);
    
    this.currentY += 25;
    this.addSeparator();
  }

  // Project Overview Section
  addProjectOverview(stages = [], expenses = []) {
    this.addSectionTitle('Project Overview');
    
    // Project Details
    const projectDetails = [
      ['Engineer:', PROJECT_DATA.engineer],
      ['Total Area:', `${formatNumber(PROJECT_DATA.totalSqft)} Sqft`],
      ['Rate per Sqft:', formatCurrency(PROJECT_DATA.perSqftRate)],
      ['Total Cost:', formatCurrency(PROJECT_DATA.totalCost)],
      ['Location:', PROJECT_DATA.location],
      ['Start Date:', formatDate(PROJECT_DATA.startDate)]
    ];

    projectDetails.forEach(([label, value], index) => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(label, this.margin, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(value, this.margin + 40, this.currentY);
      
      if (index % 2 === 0) {
        this.currentY += 7;
      } else {
        this.currentY += 10;
      }
    });

    this.currentY += 10;
  }

  // Construction Stages Section
  addConstructionStages(stages) {
    this.addSectionTitle('Construction Stages & Payment Schedule');
    
    const tableHeaders = ['Stage', 'Percentage', 'Amount', 'Status'];
    const tableData = stages.map(stage => [
      stage.name,
      `${stage.percentage}%`,
      formatCurrency(stage.amount),
      this.formatStatus(stage.status)
    ]);

    this.addTable(tableHeaders, tableData);
    this.currentY += 10;
  }

  // Expenses Section
  addExpenses(expenses) {
    this.addSectionTitle('Additional Expenses');
    
    if (expenses.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.setTextColor(150, 150, 150);
      this.doc.text('No additional expenses recorded.', this.margin, this.currentY);
      this.doc.setTextColor(0, 0, 0);
      this.currentY += 10;
      return;
    }

    const tableHeaders = ['Expense', 'Category', 'Amount', 'Status'];
    const tableData = expenses.map(expense => [
      expense.name,
      this.formatCategory(expense.category),
      formatCurrency(expense.amount),
      this.formatStatus(expense.status)
    ]);

    this.addTable(tableHeaders, tableData);
    this.currentY += 10;
  }

  // Payment Summary Section
  addPaymentSummary(stages, expenses) {
    this.addSectionTitle('Payment Summary');
    
    const totalConstruction = stages.reduce((sum, stage) => sum + stage.amount, 0);
    const paidConstruction = stages.reduce((sum, stage) => sum + stage.paid, 0);
    const balanceConstruction = totalConstruction - paidConstruction;
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const paidExpenses = expenses.reduce((sum, expense) => sum + expense.paid, 0);
    const balanceExpenses = totalExpenses - paidExpenses;
    
    const grandTotal = totalConstruction + totalExpenses;
    const totalPaid = paidConstruction + paidExpenses;
    const totalBalance = balanceConstruction + balanceExpenses;

    const summaryData = [
      ['Construction Cost:', formatCurrency(totalConstruction), formatCurrency(paidConstruction), formatCurrency(balanceConstruction)],
      ['Additional Expenses:', formatCurrency(totalExpenses), formatCurrency(paidExpenses), formatCurrency(balanceExpenses)],
      ['GRAND TOTAL:', formatCurrency(grandTotal), formatCurrency(totalPaid), formatCurrency(totalBalance)]
    ];

    const summaryHeaders = ['Category', 'Total Amount', 'Paid Amount', 'Balance'];
    
    this.addTable(summaryHeaders, summaryData, true);
    this.currentY += 15;

    // Progress Summary
    const overallProgress = Math.round((totalPaid / grandTotal) * 100);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Overall Progress:', this.margin, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${overallProgress}% Completed`, this.margin + 40, this.currentY);
    this.currentY += 7;
  }

  // Terms and Conditions
  addTermsAndConditions() {
    this.addSectionTitle('Terms & Conditions');
    
    const terms = [
      '1. All payments should be made in favor of ' + COMPANY_INFO.name,
      '2. Payments are due as per the construction stage completion',
      '3. Any additional work will be charged separately',
      '4. The quotation is valid for 30 days from the date of issue',
      '5. GST will be charged as applicable',
      '6. The construction timeline is subject to weather conditions and material availability'
    ];

    terms.forEach(term => {
      if (this.currentY > this.pageHeight - 40) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
      
      this.doc.setFontSize(9);
      this.doc.text(term, this.margin, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 10;
  }

  // Footer Section
  addFooter() {
    const footerY = this.pageHeight - 20;
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Thank you for choosing ' + COMPANY_INFO.name, this.pageWidth / 2, footerY, { align: 'center' });
    this.doc.text(`Contact: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`, this.pageWidth / 2, footerY + 4, { align: 'center' });
    this.doc.text(`License: ${COMPANY_INFO.license} | GSTIN: ${COMPANY_INFO.gstin}`, this.pageWidth / 2, footerY + 8, { align: 'center' });
  }

  // Helper Methods
  addSectionTitle(title) {
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = this.margin;
    }

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(44, 62, 80);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;
    this.addSeparator();
  }

  addSeparator() {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }

  addTable(headers, data, isBoldLastRow = false) {
    const colWidths = [60, 30, 40, 30];
    const startX = this.margin;
    
    // Table Headers
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    
    let x = startX;
    headers.forEach((header, index) => {
      this.doc.setFillColor(44, 62, 80);
      this.doc.rect(x, this.currentY, colWidths[index], 8, 'F');
      this.doc.text(header, x + 2, this.currentY + 5);
      x += colWidths[index];
    });
    
    this.currentY += 8;
    this.doc.setTextColor(0, 0, 0);

    // Table Data
    data.forEach((row, rowIndex) => {
      if (this.currentY > this.pageHeight - 30) {
        this.doc.addPage();
        this.currentY = this.margin;
        
        // Redraw headers on new page
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(255, 255, 255);
        let newX = startX;
        headers.forEach((header, index) => {
          this.doc.setFillColor(44, 62, 80);
          this.doc.rect(newX, this.currentY, colWidths[index], 8, 'F');
          this.doc.text(header, newX + 2, this.currentY + 5);
          newX += colWidths[index];
        });
        this.currentY += 8;
        this.doc.setTextColor(0, 0, 0);
      }

      this.doc.setFont('helvetica', isBoldLastRow && rowIndex === data.length - 1 ? 'bold' : 'normal');
      
      let x = startX;
      row.forEach((cell, cellIndex) => {
        this.doc.text(cell.toString(), x + 2, this.currentY + 5);
        x += colWidths[cellIndex];
      });
      
      this.currentY += 8;
    });
  }

  formatStatus(status) {
    const statusMap = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'pending': 'Pending',
      'paid': 'Paid'
    };
    return statusMap[status] || status;
  }

  formatCategory(category) {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Main Generation Method
  generateQuotation(stages, expenses, filename = 'construction-quotation.pdf') {
    try {
      // Reset document
      this.doc = new jsPDF();
      this.currentY = this.margin;

      // Add all sections
      this.addHeader();
      this.addProjectOverview(stages, expenses);
      this.addConstructionStages(stages);
      this.addExpenses(expenses);
      this.addPaymentSummary(stages, expenses);
      this.addTermsAndConditions();
      this.addFooter();

      // Save the PDF
      this.doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }

  // Generate Client Report
  generateClientReport(client, stages, expenses, filename = 'client-report.pdf') {
    try {
      this.doc = new jsPDF();
      this.currentY = this.margin;

      // Custom header for client report
      this.doc.setFontSize(20);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Client Project Report', this.margin, this.currentY);
      this.currentY += 15;

      // Client Information
      this.addSectionTitle('Client Information');
      const clientInfo = [
        ['Name:', client.name],
        ['Contact:', `${client.phone} | ${client.email}`],
        ['Address:', client.address],
        ['Project Type:', client.projectType],
        ['Budget:', client.budget],
        ['Status:', client.status],
        ['Join Date:', formatDate(client.joinDate)]
      ];

      clientInfo.forEach(([label, value]) => {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(label, this.margin, this.currentY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(value, this.margin + 30, this.currentY);
        this.currentY += 7;
      });

      this.currentY += 10;

      // Add project details
      this.addConstructionStages(stages);
      this.addExpenses(expenses);
      this.addPaymentSummary(stages, expenses);
      this.addFooter();

      this.doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating client report:', error);
      return false;
    }
  }
}

export const pdfGenerator = new PDFGenerator();
export default PDFGenerator;