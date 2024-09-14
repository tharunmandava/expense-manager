import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from 'antd';
import '../styles/inputfix.css';

const ExpenseDetails = () => {
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [participantAmounts, setParticipantAmounts] = useState({});
  const [users, setUsers] = useState([]);
  const [isAdvancedSplit, setIsAdvancedSplit] = useState(false); 
  const navigate = useNavigate();
  const { id, expenseId } = useParams();
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



  // Fetch expense details
  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/expenses/${expenseId}`);
        const { expense } = response.data;
  
        const paidByUser = users.find(user => user.user_id === expense.paid_by)?.user_name || "";
  
        setPaidBy(paidByUser); 
        setAmount(expense.amount);
      } catch (error) {
        console.error("Error fetching expense details:", error);
      }
    };
  
    fetchExpenseDetails();
  }, [users, expenseId]); 
  

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

      await axios.put(`${API_URL}/expenses`, {
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
    <div className="flex flex-col items-center min-h-screen bg-black py-4">
    {/* Green Section - Form */}
  <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
    <h1 className="text-2xl font-bold mb-6 text-white">Edit Expense</h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex space-x-4">
        <label className="block text-sm font-medium text-white w-1/2">
          Expense Title
          <input
            type="text"
            placeholder="Sunday night dinner"
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black"
            required
          /> 
          <p className="text-gray-400 text-xs mt-1">Enter a description for the expense</p>
        </label>

        <label className="block text-sm font-medium text-white w-1/2">
          Notes
          <textarea
            placeholder=""
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black"
            rows="2"
          />
        </label>
      </div>

      <div className="flex space-x-4">
        <label className="block text-sm font-medium text-white w-1/2">
          Paid By:
          <select
            value={paidBy}
            onChange={(e) => handlePaidByChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-black text-white"
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_name}>{user.user_name}</option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">Select the participant who paid for the expense</p>
        </label>

        <label className="block text-sm font-medium text-white w-1/2">
          Amount
           <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-black text-white"
            required
          /> 
        </label>
      </div>

      <div className="flex items-center space-x-10 mt-4">
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-sm font-semibold text-white ">Advanced split</span>
          <Switch
            disabled
            checked={isAdvancedSplit}
            onChange={handleToggleAdvancedSplit}
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <span className="text-sm font-semibold text-white">Reimbursement</span>
          <Switch

            className="mt-1"
          />
        </div>
      </div>
      
    </form>
  </div>

  {/* Blue Section - Participants */}
<div className="bg-gray-800 border border-gray-900 rounded-lg p-4 mb-4 max-w-3xl w-full">
  <h2 className="text-2xl font-semibold mb-4 text-white">Paid for</h2>
  {users.map((user, index) => (
    <div
      key={user.user_id}
      className={`flex items-center p-2 w-full ${
        index < users.length - 1 ? 'border-b border-gray-600' : ''
      }`}
    >
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
        className="mr-2"
      />
      <label htmlFor={`participant-${user.user_id}`} className="text-white ">
        {user.user_name}
      </label>
      {isAdvancedSplit && participants.some(p => p.user_id === user.user_id) && (
        <input
          type="number"
          value={participantAmounts[user.user_id] || 0}
          onChange={(e) => handleParticipantChange(user.user_id, Number(e.target.value))}
          className="ml-2 border border-blue-300 rounded-md w-20"
        />
      )}
    </div>
  ))}
</div>

     

      {/* Button at the Bottom Left */}
      <div className="max-w-3xl w-full flex justify-start px-4">
        <button disabled
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm  rounded-md shadow-sm  text-white font-semibold bg-[#B065FF] hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
          
        >
          Save Changes
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm  rounded-md shadow-sm  text-white font-semibold bg-red-800
             hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              DELETE
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetails;
