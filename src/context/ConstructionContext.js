import React, { createContext, useContext, useState, useEffect } from 'react';

const PROJECT_DATA = {
    projectName: "PGK Construction",
    engineer: "Er. P. Govindaraj",
    perSqftRate: 1650,
    totalSqft: 625,
    totalCost: 1031250,
    lastUpdated: new Date().toISOString().split('T')[0]
};

const INITIAL_STAGES = [
    { id: "advance", name: "Advance", percentage: 20, amount: 206250, paid: 0, status: "pending", date: "2023-09-01", notes: "Initial payment received" },
    { id: "basement", name: "Basement", percentage: 15, amount: 154687, paid: 0, status: "in-progress", date: "2023-09-15", notes: "Excavation completed, foundation work in progress" },
    { id: "lintel", name: "Lintel", percentage: 15, amount: 154687, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "roof", name: "Roof Level", percentage: 15, amount: 154687, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "inner-plastering", name: "Inner Plastering", percentage: 10, amount: 103125, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "outer-plastering", name: "Outer Plastering", percentage: 10, amount: 103125, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "tiles", name: "Tiles", percentage: 8, amount: 82500, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "electrical", name: "Electrical", percentage: 5, amount: 51562, paid: 0, status: "pending", date: "", notes: "Not started" },
    { id: "whitewash", name: "Whitewash", percentage: 2, amount: 20625, paid: 0, status: "pending", date: "", notes: "Not started" }
];

const INITIAL_EXPENSES = [
    { id: 1, name: "Septic Tank", amount: 40000, paid: 0, date: "2023-10-05", category: "septic-tank", status: "pending", notes: "Installation in progress" },
    { id: 2, name: "Sump", amount: 40000, paid: 15000, date: "2023-09-20", category: "sump", status: "paid", notes: "5000L capacity sump installed" },
    { id: 3, name: "Borewell", amount: 50000, paid: 50000, date: "2023-09-10", category: "borewell", status: "paid", notes: "Completed successfully with good water flow" }
];

const ConstructionContext = createContext();

export const useConstruction = () => {
    const context = useContext(ConstructionContext);
    if (!context) {
        throw new Error('useConstruction must be used within a ConstructionProvider');
    }
    return context;
};

export const ConstructionProvider = ({ children }) => {
    const [projectData] = useState(PROJECT_DATA);
    const [stages, setStages] = useState(() => {
        const saved = localStorage.getItem('construction-stages');
        return saved ? JSON.parse(saved) : INITIAL_STAGES;
    });
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('construction-expenses');
        return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    });
    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem('construction-payments');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('construction-stages', JSON.stringify(stages));
    }, [stages]);

    useEffect(() => {
        localStorage.setItem('construction-expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('construction-payments', JSON.stringify(payments));
    }, [payments]);

    const totalConstructionCost = projectData.totalCost;
    const paidConstructionAmount = stages.reduce((sum, stage) => sum + parseInt(stage.paid || 0), 0);
    const balanceConstructionAmount = totalConstructionCost - paidConstructionAmount;
    const totalExpensesAmount = expenses.reduce((sum, expense) => sum + parseInt(expense.amount || 0), 0);
    const paidExpensesAmount = expenses.reduce((sum, expense) => sum + parseInt(expense.paid || 0), 0);
    const balanceExpensesAmount = totalExpensesAmount - paidExpensesAmount;
    const totalProjectCost = totalConstructionCost + totalExpensesAmount;
    const totalPaid = paidConstructionAmount + paidExpensesAmount;
    const totalBalance = totalProjectCost - totalPaid;
    const overallProgress = totalProjectCost > 0 ? (totalPaid / totalProjectCost) * 100 : 0;

    const calculateStageAmount = (percentage) => {
        return Math.round((projectData.totalCost * percentage) / 100);
    };

    const determineStatus = (paid, total) => {
        if (paid === 0) return 'pending';
        if (paid >= total) return 'completed';
        return 'in-progress';
    };

    const addPaymentHistory = (paymentRecord) => {
        const newPayment = { id: Date.now(), ...paymentRecord };
        setPayments(prev => [newPayment, ...prev]);
    };

    const updateStage = (stageId, updatedData) => {
        setStages(prev => prev.map(stage => {
            if (stage.id === stageId) {
                let newPaid = stage.paid;
                if (updatedData.paid !== undefined && updatedData.paid !== stage.paid) {
                    const diff = updatedData.paid - stage.paid;
                    newPaid = updatedData.paid;
                    if (diff > 0) {
                        addPaymentHistory({
                            itemId: stageId,
                            itemName: stage.name,
                            amount: diff,
                            totalPaid: newPaid,
                            balance: stage.amount - newPaid,
                            type: 'construction',
                            date: new Date().toISOString().split('T')[0]
                        });
                    }
                }
                const newStatus = determineStatus(newPaid, stage.amount);
                return { ...stage, ...updatedData, paid: newPaid, status: newStatus };
            }
            return stage;
        }));
    };

    const addExpense = (newExpense) => {
        const expenseWithId = { ...newExpense, id: Date.now(), paid: 0, status: 'pending' };
        setExpenses(prev => [...prev, expenseWithId]);
        return expenseWithId;
    };

    const updateExpense = (expenseId, updatedData) => {
        setExpenses(prev => prev.map(expense => {
            if (expense.id === expenseId) {
                let newPaid = expense.paid;
                if (updatedData.paid !== undefined && updatedData.paid !== expense.paid) {
                    const diff = updatedData.paid - expense.paid;
                    newPaid = updatedData.paid;
                    if (diff > 0) {
                        addPaymentHistory({
                            itemId: expenseId,
                            itemName: expense.name,
                            amount: diff,
                            totalPaid: newPaid,
                            balance: expense.amount - newPaid,
                            type: 'expense',
                            date: new Date().toISOString().split('T')[0]
                        });
                    }
                }
                const newStatus = determineStatus(newPaid, expense.amount);
                return { ...expense, ...updatedData, paid: newPaid, status: newStatus };
            }
            return expense;
        }));
    };

    const addManualPayment = (paymentData) => {
        const newPayment = {
            id: Date.now(),
            type: 'other',
            ...paymentData
        };
        setPayments(prev => [newPayment, ...prev]);
    };

    const updatePayment = (paymentId, updatedData) => {
        setPayments(prev => prev.map(p => {
            if (p.id === paymentId) {
                // If amount changed and it's linked to an item, we should ideally update the item too
                // But for simplicity and safety, we'll just update the log for now unless requested otherwise
                // The prompt says "Auto-sync to history list and update related card"
                // Let's try to sync if itemId exists
                if (p.itemId && updatedData.amount !== undefined && updatedData.amount !== p.amount) {
                    const diff = updatedData.amount - p.amount;
                    if (p.type === 'construction') {
                        setStages(stages => stages.map(s => {
                            if (s.id === p.itemId) {
                                const newPaid = s.paid + diff;
                                return { ...s, paid: newPaid, status: determineStatus(newPaid, s.amount) };
                            }
                            return s;
                        }));
                    } else if (p.type === 'expense') {
                        setExpenses(expenses => expenses.map(e => {
                            if (e.id === p.itemId) {
                                const newPaid = e.paid + diff;
                                return { ...e, paid: newPaid, status: determineStatus(newPaid, e.amount) };
                            }
                            return e;
                        }));
                    }
                }
                return { ...p, ...updatedData };
            }
            return p;
        }));
    };

    const addStage = (stageData) => {
        const amount = Math.round((projectData.totalCost * stageData.percentage) / 100);
        const newStage = {
            id: Date.now().toString(), // Ensure string ID for consistency
            ...stageData,
            amount: amount,
            paid: 0,
            status: 'pending'
        };
        setStages(prev => [...prev, newStage]);
    };

    const deleteStage = (stageId) => {
        setStages(prev => prev.filter(s => s.id !== stageId));
    };

    const deleteExpense = (expenseId) => {
        setExpenses(prev => prev.filter(e => e.id !== expenseId));
    };

    const deletePayment = (paymentId) => {
        const paymentToDelete = payments.find(p => p.id === paymentId);

        // Remove from payments list
        setPayments(prev => prev.filter(p => p.id !== paymentId));

        // Sync with stages/expenses if linked
        if (paymentToDelete && paymentToDelete.itemId) {
            const amount = Number(paymentToDelete.amount);

            if (paymentToDelete.type === 'construction') {
                setStages(stages => stages.map(s => {
                    if (s.id === paymentToDelete.itemId) {
                        const newPaid = Math.max(0, s.paid - amount); // Prevent negative
                        return { ...s, paid: newPaid, status: determineStatus(newPaid, s.amount) };
                    }
                    return s;
                }));
            } else if (paymentToDelete.type === 'expense') {
                setExpenses(expenses => expenses.map(e => {
                    if (e.id === paymentToDelete.itemId) {
                        const newPaid = Math.max(0, e.paid - amount);
                        return { ...e, paid: newPaid, status: determineStatus(newPaid, e.amount) };
                    }
                    return e;
                }));
            }
        }
    };

    const getAllPayments = () => {
        return payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const value = {
        projectData,
        stages,
        expenses,
        payments,
        totalConstructionCost,
        paidConstructionAmount,
        balanceConstructionAmount,
        totalExpensesAmount,
        paidExpensesAmount,
        balanceExpensesAmount,
        totalProjectCost,
        totalPaid,
        totalBalance,
        overallProgress,
        calculateStageAmount,
        updateStage,
        addStage,
        deleteStage,
        addExpense,
        updateExpense,
        deleteExpense,
        getAllPayments,
        addManualPayment,
        updatePayment,
        deletePayment
    };

    return (
        <ConstructionContext.Provider value={value}>
            {children}
        </ConstructionContext.Provider>
    );
};
