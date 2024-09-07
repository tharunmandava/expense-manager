import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

const ExpenseDetails = () => {
  const { expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")));

  const fetchUsername = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/`);
      localStorage.setItem("users", JSON.stringify(res.data));
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching usernames: ", error)
    }
  }

  // Fetch expense data based on the ID
  const fetchExpense = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${expenseId}`);
      setExpense(response.data);
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };
/*
  const users = useMemo(() => {
    const storedUsers = localStorage.getItem("users");
    console.log(storedUsers)
    return storedUsers ? JSON.parse(storedUsers) : [];
  }, []);
*/
  const getUserName = (userId) => {
    const user = users.filter(user => {return user.user_id === userId.toString()});
    return user.length === 1 ? user[0].name : `Unknown`;
  };

  useEffect(() => {
    if (users == null) {
      const users = fetchUsername();
    }
    fetchExpense();
  }, [expenseId]);

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
        <span key={participant}>
          {getUserName(participant)}{index < expense.participants.length - 1 ? ", " : ""}
        </span>
      ))}</p>
    </div>
  );
};

export default ExpenseDetails;
