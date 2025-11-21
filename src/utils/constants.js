// Project Constants
export const PROJECT_DATA = {
  projectName: "PGK Construction",
  engineer: "Er. P. Govindaraj",
  perSqftRate: 1650,
  totalSqft: 625,
  totalCost: 1031250,
  lastUpdated: "2023-10-15",
  location: "Chennai, Tamil Nadu",
  startDate: "2023-09-01",
  estimatedCompletion: "2024-06-30"
};

// Initial Construction Stages
export const INITIAL_STAGES = [
  { 
    id: "advance", 
    name: "Advance", 
    percentage: 20, 
    amount: 206250, 
    paid: 206250, 
    status: "completed", 
    date: "2023-09-01", 
    notes: "Initial payment received",
    duration: 0
  },
  { 
    id: "basement", 
    name: "Basement", 
    percentage: 15, 
    amount: 154687, 
    paid: 50000, 
    status: "in-progress", 
    date: "2023-09-15", 
    notes: "Excavation completed, foundation work in progress",
    duration: 45
  },
  { 
    id: "lintel", 
    name: "Lintel", 
    percentage: 15, 
    amount: 154687, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 30
  },
  { 
    id: "roof-level", 
    name: "Roof Level", 
    percentage: 15, 
    amount: 154687, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 45
  },
  { 
    id: "inner-plastering", 
    name: "Inner Plastering", 
    percentage: 10, 
    amount: 103125, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 25
  },
  { 
    id: "outer-plastering", 
    name: "Outer Plastering", 
    percentage: 10, 
    amount: 103125, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 20
  },
  { 
    id: "tiles", 
    name: "Tiles", 
    percentage: 8, 
    amount: 82500, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 30
  },
  { 
    id: "electrical", 
    name: "Electrical", 
    percentage: 5, 
    amount: 51562, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 20
  },
  { 
    id: "whitewash", 
    name: "Whitewash", 
    percentage: 2, 
    amount: 20625, 
    paid: 0, 
    status: "pending", 
    date: "", 
    notes: "",
    duration: 15
  }
];

// Initial Expenses
export const INITIAL_EXPENSES = [
  { 
    id: 1, 
    name: "Borewell", 
    amount: 50000, 
    paid: 50000, 
    date: "2023-09-10", 
    category: "borewell", 
    status: "paid", 
    notes: "Completed successfully with good water flow",
    vendor: "Water Solutions Inc."
  },
  { 
    id: 2, 
    name: "Sump", 
    amount: 15000, 
    paid: 15000, 
    date: "2023-09-20", 
    category: "sump", 
    status: "paid", 
    notes: "5000L capacity sump installed",
    vendor: "Plumbing Masters"
  },
  { 
    id: 3, 
    name: "Septic Tank", 
    amount: 25000, 
    paid: 0, 
    date: "2023-10-05", 
    category: "septic-tank", 
    status: "pending", 
    notes: "Installation in progress",
    vendor: "Sanitation Experts"
  }
];

// Clients Data
export const CLIENTS_DATA = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    address: "123 Main Street, Chennai, Tamil Nadu - 600001",
    projectType: "Residential House",
    budget: "₹25,00,000",
    status: "Active",
    joinDate: "2023-08-15",
    projectStart: "2023-09-01",
    projectArea: "1200 Sqft"
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 8765432109",
    email: "priya@example.com",
    address: "456 Oak Avenue, Bangalore, Karnataka - 560001",
    projectType: "Commercial Building",
    budget: "₹50,00,000",
    status: "Completed",
    joinDate: "2023-06-10",
    projectStart: "2023-07-01",
    projectArea: "2500 Sqft"
  },
  {
    id: 3,
    name: "Vikram Singh",
    phone: "+91 7654321098",
    email: "vikram@example.com",
    address: "789 Pine Road, Hyderabad, Telangana - 500001",
    projectType: "Villa Construction",
    budget: "₹75,00,000",
    status: "Planning",
    joinDate: "2023-09-20",
    projectStart: "2023-11-01",
    projectArea: "3000 Sqft"
  }
];

// House Specifications
export const HOUSE_SPECIFICATIONS = [
  {
    icon: "fas fa-layer-group",
    title: "Foundation",
    description: "Concrete with steel reinforcement as per IS code"
  },
  {
    icon: "fas fa-cube",
    title: "Structure",
    description: "RCC framed structure with M25 grade concrete"
  },
  {
    icon: "fas fa-border-style",
    title: "Walls",
    description: "9\" thick brick walls with cement plastering"
  },
  {
    icon: "fas fa-tint",
    title: "Plumbing",
    description: "CPVC pipes with modern fixtures and proper drainage"
  },
  {
    icon: "fas fa-bolt",
    title: "Electrical",
    description: "Concealed copper wiring with MCB protection"
  },
  {
    icon: "fas fa-paint-roller",
    title: "Finishing",
    description: "Premium quality paints with weatherproof coating"
  }
];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { value: "borewell", label: "Borewell", icon: "fas fa-water" },
  { value: "sump", label: "Sump", icon: "fas fa-tint" },
  { value: "septic-tank", label: "Septic Tank", icon: "fas fa-recycle" },
  { value: "electrical", label: "Electrical", icon: "fas fa-bolt" },
  { value: "plumbing", label: "Plumbing", icon: "fas fa-wrench" },
  { value: "material", label: "Material", icon: "fas fa-box" },
  { value: "labor", label: "Labor", icon: "fas fa-hard-hat" },
  { value: "permit", label: "Permit", icon: "fas fa-file-contract" },
  { value: "transport", label: "Transport", icon: "fas fa-truck" },
  { value: "other", label: "Other", icon: "fas fa-receipt" }
];

// Client Status Options
export const CLIENT_STATUS = [
  { value: "Planning", label: "Planning", color: "#f39c12" },
  { value: "Active", label: "Active", color: "#27ae60" },
  { value: "On Hold", label: "On Hold", color: "#e74c3c" },
  { value: "Completed", label: "Completed", color: "#3498db" }
];

// Project Types
export const PROJECT_TYPES = [
  "Residential House",
  "Commercial Building",
  "Villa Construction",
  "Apartment Complex",
  "Renovation",
  "Extension",
  "Industrial Building",
  "Other"
];

// Payment Methods
export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "fas fa-money-bill" },
  { value: "bank-transfer", label: "Bank Transfer", icon: "fas fa-university" },
  { value: "cheque", label: "Cheque", icon: "fas fa-money-check" },
  { value: "upi", label: "UPI", icon: "fas fa-mobile-alt" },
  { value: "online", label: "Online Payment", icon: "fas fa-credit-card" }
];

// Company Information
export const COMPANY_INFO = {
  name: "PGK Construction",
  owner: "Er. P. Govindaraj",
  license: "TN01/ABC/12345",
  experience: "15+ Years",
  address: "123 Construction Street, Chennai, Tamil Nadu - 600001",
  phone: "+91 9876543210",
  email: "info@pgkconstruction.com",
  website: "www.pgkconstruction.com",
  gstin: "29ABCDE1234F1Z5"
};

// Color Scheme
export const COLORS = {
  primary: "#2c3e50",
  secondary: "#3498db",
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  info: "#17a2b8",
  light: "#ecf0f1",
  dark: "#2c3e50",
  gray: "#95a5a6"
};

// Local Storage Keys
export const STORAGE_KEYS = {
  STAGES: "construction-stages",
  EXPENSES: "construction-expenses",
  CLIENTS: "construction-clients",
  PAYMENTS: "construction-payments",
  EXPENSE_PAYMENTS: "expense-payments",
  SETTINGS: "construction-settings"
};

// API Endpoints (for future integration)
export const API_ENDPOINTS = {
  projects: "/api/projects",
  clients: "/api/clients",
  payments: "/api/payments",
  expenses: "/api/expenses",
  reports: "/api/reports"
};