import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ExpenseDetails = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  // Fetch expense data based on the ID
  const fetchExpense = async () => {
    try {
      const response = await axios.get(`https://66d5d955f5859a704267a78f.mockapi.io/api/expenses/${id}`);
      setExpense(response.data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Expense Details</h1>
      <p><strong>Paid By:</strong> {expense.paid_by}</p>
      <p><strong>Amount:</strong> ${expense.amount}</p>
      <p><strong>Date:</strong> {new Date(expense.expense_date * 1000).toLocaleDateString()}</p>
      <p><strong>ID:</strong> {expense.id}</p>
      <p><strong>Expenses ID:</strong> {expense.expenses_id}</p>
      <p><strong>User ID:</strong> {expense.userId}</p>
    </div>
  );
};

export default ExpenseDetails;
