import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import ManageNavBar from "../components/ManageNavBar";
import { IoIosArrowForward } from "react-icons/io";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [group, _] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/by-group/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();  
  }, [id]);
  
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'short', year: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  const [day,month,year] = formattedDate.split(' ');
  return `${day} ${month}, ${year}`;
};


//--------------------------------------------------------------------------------------------------



return (
  <div className="min-h-screen p-4">
    <div className="flex flex-col items-center">
      <ManageNavBar />
      {group && <h1 className="text-2xl font-bold mb-4">Expenses for {group.group_name}</h1>}

      {/* Bottom section */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold">Expenses</h3>
            <p className="text-gray-400 text-sm mt-1">Expenses of the group</p>
          </div>
          <NavLink
            to={`/groups/${id}/expenses/add`}
            className="border border-transparent bg-green-600 hover:bg-green-700 p-2 w-10 h-10 flex items-center justify-center rounded-md text-white text-lg"
          >
            +
          </NavLink>
        </div>
        <ul className="space-y-0">
          {expenses.map((expense) => (
            <NavLink
              key={expense.expense_id}
              to={`/groups/${id}/expenses/${expense.expense_id}/edit`} // Adjust the path according to your routing setup
              className="relative block p-4 bg-gray-800 hover:bg-gray-600 rounded-lg text-white"
            >
              <div className="flex-1 pr-24">
                <h2 className="text-sm font-semibold mb-1 pb-2">Expense: {expense.expense_id}</h2>
                <p className="text-gray-400 text-xs ">
                  paid by <span className="text-gray-300 font-bold">{expense.paid_by}</span>
                </p>
              </div>
              <div className="absolute right-4 top-2 flex flex-col items-end p-2">
                <p className="text-sm font-semibold mb-1 pb-3">{expense.amount}</p> {/* Amount */}
                <p className="text-xs text-gray-400">{formatDate(expense.expense_date.slice(0, 10))}</p> {/* Date */}
              </div>
            </NavLink>
          ))}
        </ul>
      </div>
    </div>
  </div>
);






};

export default Expenses;