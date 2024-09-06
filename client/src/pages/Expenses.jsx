import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const users = useMemo(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/list-all`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getUserName = (userId) => {
    console.log(users);
    const user = users.find((user) => user.user_id === userId);
    return user ? user.name : "Unknown";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <NavLink
        to="/manage/expenses/add"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
      >
        + Add Expense
      </NavLink>
      <ul className="mt-4">
        {expenses.map((expense) => (
          <li key={expense.expense_id} className="border p-4 mb-2 rounded">
            <h2 className="text-lg font-semibold">
              Paid by: {getUserName(expense.paid_by)}
            </h2>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.expense_date.slice(0, 10)}</p>
            <NavLink
              to={`/manage/expenses/${expenses.expense_id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View Details
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
