import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ExpenseDetails = () => {
  const { expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchExpense = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${expenseId}`);
      setExpense(response.data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [expenseId]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Expense Details</h1>
      <p><strong>Paid By:</strong> {expense.expense.paid_by}</p>
      <p><strong>Amount:</strong> ${expense.expense.amount}</p>
      <p><strong>Date:</strong> {expense.expense.expense_date.slice(0, 10)}</p>
      {expense.expense.description && <p><strong>Description:</strong> {expense.expense.description}</p>}
    </div>
  );
};

export default ExpenseDetails;
