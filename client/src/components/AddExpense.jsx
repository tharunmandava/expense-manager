import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, {
        paid_by: paidBy,
        amount: Number(amount),
        expense_date: Math.floor(new Date(expenseDate).getTime() / 1000), 
        created_at: Math.floor(new Date().getTime() / 1000),
      });
      navigate("/manage/expenses"); 
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Add New Expense</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Paid By:
          <input
            type="text"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 mt-2">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 mt-2">
          Expense Date:
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
