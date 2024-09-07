import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

const ExpenseDetails = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch expense data based on the ID
  const fetchExpense = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${id}`);
      setExpense(response.data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  const users = useMemo(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  }, []);

  const getUserName = (userId) => {
    const user = users.find((user) => user.user_id === userId);
    return user ? user.name : `Unknown`;
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
      <p><strong>Paid By:</strong> {getUserName(expense.transaction.paid_by)}</p>
      <p><strong>Amount:</strong> ${expense.transaction.amount}</p>
      <p><strong>Date:</strong> {expense.transaction.expense_date.slice(0, 10)}</p>
      <p><strong>Expenses ID:</strong> {expense.transaction.expense_id}</p>
      <p><strong>User ID:</strong> {expense.transaction.userId}</p>
      <p><strong>Participants:</strong> {expense.participants.map((participant, index) => (
        <span key={participant.user_id}>
          {getUserName(participant.user_id)}{index < expense.participants.length - 1 ? ", " : ""}
        </span>
      ))}</p>
    </div>
  );
};

export default ExpenseDetails;
