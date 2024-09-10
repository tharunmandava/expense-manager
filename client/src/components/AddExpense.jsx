import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddExpense = () => {
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantAmounts, setParticipantAmounts] = useState({});
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/users/${id}`);
        setUsers(response.data);
        localStorage.setItem("users", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [API_URL, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paidById = users.find(user => user.user_name === paidBy)?.user_id;
      if (!paidById) throw new Error("Invalid payer.");

      await axios.post(`${API_URL}/expenses`, {
        amount: Number(amount),
        paid_by: paidById,
        group_id: id,
        participantAmounts: Object.fromEntries(participants.map(user => [
          user.user_id,
          participantAmounts[user.user_id] || 0
        ]))
      });

      navigate(`/groups/${id}/expenses`);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleParticipantChange = (userId, amount) => {
    setParticipantAmounts(prev => ({
      ...prev,
      [userId]: amount
    }));
  };

  const handleAddParticipant = (user) => {
    if (!participants.some(p => p.user_id === user.user_id)) {
      setParticipants([...participants, user]);
      setParticipantAmounts(prev => ({
        ...prev,
        [user.user_id]: 0
      }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Add New Expense</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Paid By:
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_name}>{user.user_name}</option>
            ))}
          </select>
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
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Participants</h2>
          {users.map(user => (
            <div key={user.user_id} className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`participant-${user.user_id}`}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAddParticipant(user);
                  } else {
                    setParticipants(participants.filter(p => p.user_id !== user.user_id));
                    setParticipantAmounts(prev => {
                      const newAmounts = { ...prev };
                      delete newAmounts[user.user_id];
                      return newAmounts;
                    });
                  }
                }}
                checked={participants.some(p => p.user_id === user.user_id)}
              />
              <label htmlFor={`participant-${user.user_id}`} className="ml-2">
                {user.user_name}
              </label>
              {participants.some(p => p.user_id === user.user_id) && (
                <input
                  type="number"
                  value={participantAmounts[user.user_id] || 0}
                  onChange={(e) => handleParticipantChange(user.user_id, Number(e.target.value))}
                  className="ml-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          ))}
        </div>
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
