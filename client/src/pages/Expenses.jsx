import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import ManageNavBar from "../components/ManageNavBar";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupCurrency, setGroupCurrency] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/users/${id}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [id]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/by-group/${id}`);
      const expensesWithParticipants = await Promise.all(
        response.data.map(async (expense) => {
          const participants = await fetchExpenseParticipants(expense.expense_id);
          return { ...expense, participants };
        })
      );
      setExpenses(expensesWithParticipants);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchExpenseParticipants = async (expenseId) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${expenseId}`);
      return response.data.expense_participants;
    } catch (error) {
      console.error("Error fetching expense participants:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCurrency = async () => {
      try{
        const response = await axios.get(`${API_URL}/groups/${id}`)
        const { group_currency } = response.data;
        setGroupCurrency(group_currency);
      } catch (e){
        console.error("Error fetching currency:", e);
      };
    };

    fetchCurrency();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month}, ${year}`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <ManageNavBar />
        </div>

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
            {expenses
              .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
              .map((expense) => {
                const participantNames = expense.participants
                  .map(participant => users.find(user => user.user_id === participant.user_id)?.user_name)
                  .filter(name => name !== undefined)
                  .join(", ");

                return (
                  <NavLink
                    key={expense.expense_id}
                    to={`/groups/${id}/expenses/${expense.expense_id}/edit`}
                    className="relative block p-4 bg-gray-800 hover:bg-gray-600 rounded-lg text-white"
                  >
                    <div className="flex-1 pr-24">
                      <h2 className="text-sm font-semibold mb-1 pb-2">{expense.title}</h2>
                      <p className="text-gray-400 text-xs">
                        paid by <span className="text-gray-300 font-bold">{expense.paid_by}</span> for <span className="text-gray-300 font-bold">{participantNames}</span>
                      </p>
                    </div>
                    <div className="absolute right-4 top-2 flex flex-col items-end p-2">
                      <p className="text-sm font-semibold mb-1 pb-3">{groupCurrency} {expense.amount}</p>
                      <p className="text-xs text-gray-400">{formatDate(expense.expense_date)}</p>
                    </div>
                  </NavLink>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
