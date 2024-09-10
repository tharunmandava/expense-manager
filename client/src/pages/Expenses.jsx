import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [group, setGroup] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/${id}`);
      const newGroup = response.data;
  
      const storedGroupIds = JSON.parse(localStorage.getItem('groupIds')) || [];
      
      const updatedGroupIds = storedGroupIds.filter(groupId => groupId !== newGroup.group_id);
  
      updatedGroupIds.unshift(newGroup.group_id);
  
      localStorage.setItem('groupIds', JSON.stringify(updatedGroupIds));
      
      setGroup(newGroup);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };


  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/by-group/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchGroup();  
    fetchExpenses();  
  }, [id]);

  return (
    <div className="p-4">
      {group && <h1 className="text-2xl font-bold">Expenses for {group.group_name}</h1>}
      <NavLink
        to={`/groups/${id}/expenses/add`}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
      >
        + Add Expense
      </NavLink>
      <ul className="mt-4">
        {expenses.map((expense) => (
          <li key={expense.expense_id} className="border p-4 mb-2 rounded">
            <h2 className="text-lg font-semibold">Expense ID: {expense.expense_id}</h2>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.expense_date.slice(0, 10)}</p>
            <NavLink
              to={`/groups/${id}/expenses/${expense.expense_id}/edit`}
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