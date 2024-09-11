import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from 'antd';

const AddExpense = () => {
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [participantAmounts, setParticipantAmounts] = useState({});
  const [users, setUsers] = useState([]);
  const [isAdvancedSplit, setIsAdvancedSplit] = useState(false); 
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch users and set participants with even split
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/users/${id}`);
        setUsers(response.data);
        localStorage.setItem("users", JSON.stringify(response.data));
        
        // Default to even split among all users
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    calculateEvenSplit(participants, amount, users.find(u => u.user_name === paidBy)?.user_id);
  }, [amount]);

  const calculateEvenSplit = (participants, totalAmount, paidByUserId) => {
    const numberOfParticipants = participants.length;
    if (numberOfParticipants === 0) return;

    const evenSplit = totalAmount / numberOfParticipants;

    const updatedAmounts = participants.reduce((acc, participant) => {
      acc[participant.user_id] = evenSplit;
      return acc;
    }, {});

    // Adjust the amount for the `paid_by` user
    if (paidByUserId) {
      updatedAmounts[paidByUserId] = evenSplit - totalAmount;
    }

    setParticipantAmounts(updatedAmounts);
  };

  const adjustParticipantAmounts = (userId, customAmount) => {
    // Calculate the total amount of all participants
    const totalParticipants = Object.keys(participantAmounts).length;
    const totalAmount = Object.values(participantAmounts).reduce((sum, amt) => sum + amt, 0);

    // Adjust the amounts
    const updatedAmounts = { ...participantAmounts, [userId]: customAmount };

    // Calculate the remaining amount to be distributed among other participants
    const remainingAmount = amount - customAmount;
    const remainingParticipants = totalParticipants - 1;

    if (remainingParticipants > 0) {
      const splitAmount = remainingAmount / remainingParticipants;
      for (const [id, amt] of Object.entries(updatedAmounts)) {
        if (id !== userId) {
          updatedAmounts[id] = splitAmount;
        }
      }
    }

    setParticipantAmounts(updatedAmounts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paidById = users.find(user => user.user_name === paidBy)?.user_id;
      if (!paidById) throw new Error("Invalid payer.");

      await axios.post(`${API_URL}/expenses`, {
        amount: Number(amount),
        paid_by: paidById,
        group_id: id,
        participantAmounts
      });

      navigate(`/groups/${id}/expenses`);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handlePaidByChange = (paidByUserName) => {
    setPaidBy(paidByUserName);
    const paidByUserId = users.find(user => user.user_name === paidByUserName)?.user_id;
    calculateEvenSplit(participants, amount, paidByUserId); 
  };

  const handleParticipantChange = (userId, customAmount) => {
    if (isAdvancedSplit) {
      adjustParticipantAmounts(userId, customAmount);
    } else {
      setParticipantAmounts(prev => ({
        ...prev,
        [userId]: customAmount
      }));
    }
  };

  const handleAddParticipant = (user) => {
    if (!participants.some(p => p.user_id === user.user_id)) {
      setParticipants([...participants, user]);
      calculateEvenSplit([...participants, user], amount, users.find(u => u.user_name === paidBy)?.user_id);
    }
  };

  const handleToggleAdvancedSplit = () => {
    setIsAdvancedSplit(!isAdvancedSplit);
    if (!isAdvancedSplit) {
      // Reset to even split when toggling off advanced split
      calculateEvenSplit(participants, amount, users.find(u => u.user_name === paidBy)?.user_id);
    }
  };

  const handleAmountChange = (e) => {
    const newAmount = Number(e.target.value);
    setAmount(newAmount);

    if (!isAdvancedSplit) {
      // Recalculate even split when amount changes in simple mode
      calculateEvenSplit(participants, newAmount, users.find(u => u.user_name === paidBy)?.user_id);
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
            onChange={(e) => handlePaidByChange(e.target.value)}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_name}>{user.user_name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700 mt-4">
          Amount:
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            className="block text-sm font-medium text-grey-500 mt-4 w-20"
            required
          />
        </label>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Participants <Switch checked={isAdvancedSplit} onChange={handleToggleAdvancedSplit} /></h2>
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
              {isAdvancedSplit && participants.some(p => p.user_id === user.user_id) && (
                <input
                  type="number"
                  value={participantAmounts[user.user_id] || 0}
                  onChange={(e) => handleParticipantChange(user.user_id, Number(e.target.value))}
                  className="ml-2 border border-gray-300 rounded-md w-20"
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
