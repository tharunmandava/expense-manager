import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/inputfix.css";
import ToggleSwitch from "../components/ToggleSwitch";

const EditExpense = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id, expenseId } = useParams();

  const [usersData, setUsersData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [paidBy, setPaidBy] = useState(-1);
  const [groupCurrency, setGroupCurrency] = useState("");
  const [isAdvancedSplit, setIsAdvancedSplit] = useState(localStorage.getItem(`${expenseId}`) === 'true');
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [isAnyParticipantChecked, setIsAnyParticipantChecked] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/users/${id}`);
        const users = response.data;
        
        const exp = await axios.get(`${API_URL}/expenses/${expenseId}`);
        const { expense, expense_participants } = exp.data;
  
        setPaidBy(expense.paid_by);
        setAmount(expense.amount);
        setExpenseTitle(expense.title);
        setExpenseDescription(expense.description);
        
        
        setUsersData(
          users.map((userData) => {
              
            const participant = expense_participants.find(
              (p) => p.user_id === userData.user_id
            );

            return {
              user: userData,
              isParticipant: participant.amount > 0 || (expense.paid_by == participant.user_id && participant.amount != -expense.amount),
              amount: parseFloat(participant.amount) + (participant.user_id === expense.paid_by ? parseFloat(expense.amount) : 0)
            };
            
          })
        );
      } catch (error) {
        console.error("Error fetching expense details:", error);
      }
    };
  
    fetchExpenseDetails();
  }, [expenseId]);
  


  // set amounts to 0
  useEffect(() => {
    setAmount(0);
    const updatedUsersData = usersData.map((userData) => {
        return {
          ...userData,
          amount: 0,
        };
    });
    setUsersData(updatedUsersData);
  }, [isAdvancedSplit]);

  // Fetch currency
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


  const doEvenSplit = async (usersData, totalAmount, paidBy) => {
    const participantsNumber = usersData.filter(
      (userData) => userData.isParticipant,
    ).length; //count number of participants among users

    setUsersData((usersData) => {
      const evenSplit = totalAmount / participantsNumber;
      const newUsersData = usersData.map((userData) => {
        if (userData.isParticipant) {
          userData.amount = evenSplit;
        } else {
          userData.amount = 0;
        }
        if (userData.user.user_id === paidBy) userData.amount -= totalAmount;
        return userData;
      });
      return newUsersData;
    });
  };

  const doAdvSplit = async (usersData, totalAmount, paidBy) => {

    setUsersData((usersData) => {
      
      const newUsersData = usersData.map((userData) => {
        if (userData.user.user_id === paidBy) userData.amount -= totalAmount;
        return userData;
      });
      return newUsersData;
    });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    setLoading(true);
  
    try {
      await axios.delete(`${API_URL}/expenses/${expenseId}`);
      navigate(`/groups/${id}/expenses`);
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally{
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    setIsSubmitted(true);
    
    const hasInvalidUserAmount = usersData.some(userData => userData.isParticipant && userData.amount <= 0);
    if (paidBy == -1 || amount <= 0 || expenseTitle.trim() == "" || expenseTitle.length > 255 || !isAnyParticipantChecked || isAdvancedSplit && hasInvalidUserAmount){
      window.scroll(0, 0);
      return;
    }

    if (isAdvancedSplit) {
      await doAdvSplit(usersData, amount, paidBy);
    } else {
      await doEvenSplit(usersData, amount, paidBy);
    }

    let participantAmounts = {};
    usersData.map((userData) => {
      participantAmounts[userData.user.user_id] = userData.amount;
    });

    console.log(
      `submit ${JSON.stringify({
        amount: Number(amount),
        paid_by: paidBy,
        group_id: id,
        participantAmounts: participantAmounts,
      })}`,
    );

    setLoading(true);
    try {
      if (paidBy === -1) throw new Error("Invalid payer.");

      await axios.put(`${API_URL}/expenses/${expenseId}`, {
        title: expenseTitle,
        description: expenseDescription,
        amount: Number(amount),
        paid_by: paidBy,
        group_id: id,
        participantAmounts: participantAmounts,
      });
      navigate(`/groups/${id}/expenses`);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally{
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsAdvancedSplit(!isAdvancedSplit);
  }

  const calculateTotalAmount = (usersData) => {
    const totalAmount = usersData
    .filter((user) => user.isParticipant)
    .reduce((sum, user) => sum + (user.amount || 0), 0);

    if (totalAmount){
      setAmount(totalAmount);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screenpy-4 p-4">
      {/* Green Section - Form */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Edit Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
          <label
            className={`block text-sm font-medium ${
              isSubmitted && expenseTitle.trim() == "" || expenseTitle.length > 255 ? "text-red-500" : "text-white"
            } w-1/2`}
          >
            Expense Title {expenseTitle.length > 255 && " (max 255 characters)"}
            <input
              type="text"
              value={expenseTitle}
              onChange={(e) => {
                setExpenseTitle(e.target.value);
              }}
              placeholder="Sunday night dinner"
              className={`mt-1 block w-full px-3 py-2 border ${
                isSubmitted && expenseTitle.trim() == "" || expenseTitle.length > 255 ? "border-red-500" : "border-gray-700"
              } rounded-md text-white bg-black focus:outline-none focus:ring-primary-100 focus:border-primary-100`}
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              Enter a description for the expense
            </p>
          </label>

            <label className="block text-sm font-medium text-white w-1/2">
              Notes
              <textarea
                value={expenseDescription}
                onChange={(e) => {
                  setExpenseDescription(e.target.value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black focus:outline-none focus:ring-primary-100 focus:border-primary-100"
                rows="2"
              />
            </label>
          </div>

          <div className="flex space-x-4">
          <label
            className={`block text-sm font-medium ${
              isSubmitted && paidBy == -1 ? "text-red-500" : "text-white"
            } w-1/2`}
          >
            Paid By:
            <select
              value={paidBy}
              onChange={(e) => {
                setPaidBy(e.target.value)
              }}
              className={`mt-1 block w-full px-3 py-2 border ${
                isSubmitted && paidBy == -1 ? "border-red-500" : "border-gray-700"
              } rounded-md bg-black text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100`}
              required
            >
              <option value="-1" disabled>Select User</option>
              {usersData.map((userData) => (
                <option
                  key={userData.user.user_id}
                  value={userData.user.user_id}
                >
                  {userData.user.user_name}
                </option>
              ))}
            </select>
            <p className="text-gray-400 text-xs mt-1">
              Select the participant who paid for the expense
            </p>
          </label>


          <label className={`block text-sm font-medium ${isSubmitted && amount <= 0 ? 'text-red-500' : 'text-white'} w-1/2`}>
            Amount ({groupCurrency})
            <input
              type="number"
              value={amount}
              disabled={isAdvancedSplit}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className={`mt-1 block w-full px-3 py-2 border ${isSubmitted && amount <=  0 ? 'border-red-500' : 'border-gray-700'} rounded-md 
              ${isAdvancedSplit ? 'bg-gray-600 cursor-not-allowed' : 'bg-black cursor-default'} text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100`}
              required
            />
          </label>

          </div>

          {/* advanced split*/}

          <div className="flex items-center space-x-5 mt-4">
            <div className="flex flex-col items-start space-y-1 mt-4">
              <div className="flex items-center space-x-4">
              <ToggleSwitch 
                label = "Advanced Split"
                isChecked={isAdvancedSplit}
                onChange={handleToggle}
              />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Blue Section - Participants */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-4 mb-4 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4 text-white">Paid for</h2>
        {usersData.map((userData, index) => (
          <div
            key={userData.user.user_id}
            className={`flex items-center p-2 w-full ${
              index < usersData.length - 1 ? "border-b border-gray-600" : ""
            }`}
          >
            <input
              type="checkbox"
              id={`participant-${userData.user.user_id}`}
              onChange={(e) => {
                const updatedUsersData = usersData.map((userData, i) => {
                  if (i === index) {
                    return {
                      ...userData,
                      isParticipant: e.target.checked,
                      amount: !e.target.checked ? 0 : userData.amount,
                    };
                  }
                  return userData;
                });
                setUsersData(updatedUsersData);

                calculateTotalAmount(updatedUsersData);

                setIsAnyParticipantChecked(
                  updatedUsersData.some((user) => user.isParticipant)
                );

              }}

              checked={userData.isParticipant}
              className="mr-2"
            />
            <label
              htmlFor={`participant-${userData.user.user_id}`}
              className={`font-bold ${
                !isAnyParticipantChecked ? " text-red-500" : "text-white"
              }`}
            >
              {userData.user.user_name}
            </label>

            {isAdvancedSplit && userData.isParticipant && !isLoading && (
              <input
                type="number"
                value={userData.amount || 0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const updatedUsersData = usersData.map((userData, i) => {
                    if (i === index) {
                      return {
                        ...userData,
                        amount: parseFloat(e.target.value) || 0,
                      };
                    }
                    return userData;
                  });
                  setUsersData(updatedUsersData);

                  calculateTotalAmount(updatedUsersData);
                }}
                className={`mt-1 ml-4 h-8 w-36 px-3 py-2 border ${
                  isSubmitted && userData.amount <= 0 ? "border-red-500" : "border-gray-700"
                } rounded-md bg-black text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100`}
                required
              />
            )}
          </div>
        ))}


       {!isAnyParticipantChecked && (
              <p className="text-red-500 mt-2">The expense must be paid for at least one participant.</p>
       )} 
      </div>
      
      {/* Button at the Bottom Left */}
      <div className="w-full max-w-3xl flex justify-between">
      <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white font-semibold bg-[#B065FF] hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Save Changes
        </button>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white font-semibold bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => navigate(`/groups/${id}/expenses`)}
        >
          Cancel
        </button>
        
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white font-semibold bg-red-800 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleDelete}
          disabled={isLoading}
        > 
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditExpense;