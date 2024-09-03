import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses data from the API
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("https://g2m4e.wiremockapi.cloud/api/list-expenses");
      console.log(response.data)
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
          <li key={expense.id} className="border p-4 mb-2 rounded">
            <h2 className="text-lg font-semibold">{expense.paid_by}</h2>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.expense_date.slice(0, 10)}</p>
            <NavLink
              to={`/manage/expenses/${expense.expense_id}`}
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
