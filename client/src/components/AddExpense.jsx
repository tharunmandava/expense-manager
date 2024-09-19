import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from "antd";
import "../styles/inputfix.css";

const AddExpense = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const [usersData, setUsersData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [paidBy, setPaidBy] = useState(-1);
  const [isAdvancedSplit, setIsAdvancedSplit] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/users/${id}`);
        localStorage.setItem("users", JSON.stringify(response.data));

        setUsersData(
          response.data.map((user) => {
            return { user: user, isParticipant: true, amount: 0 };
          }),
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  /*
  useEffect(() => {
    doEvenSplit(usersData, amount, paidBy);
  }, [usersData, amount, paidBy]);
*/
  const doEvenSplit = (usersData, totalAmount, paidBy) => {
    const participantsNumber = usersData.filter(
      (userData) => userData.isParticipant,
    ).length; //count number of participants among users
    if (participantsNumber === 0 || !paidBy) return;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paidBy === -1 || amount === 0) return;
    let participantAmounts = {};
    usersData.map((userData) => {
      if (userData.amount !== 0)
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
    try {
      if (paidBy === -1) throw new Error("Invalid payer.");

      await axios.post(`${API_URL}/expenses`, {
        amount: Number(amount),
        paid_by: paidBy,
        group_id: id,
        participantAmounts: participantAmounts,
      });
      navigate(`/groups/${id}/expenses`);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screenpy-4">
      {/* Green Section - Form */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Create Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <label className="block text-sm font-medium text-white w-1/2">
              Expense Title
              <input
                type="text"
                placeholder="Sunday night dinner"
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black focus:outline-none focus:ring-primary-100 focus:border-primary-100"
                required
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter a description for the expense
              </p>
            </label>

            <label className="block text-sm font-medium text-white w-1/2">
              Notes
              <textarea
                placeholder=""
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black focus:outline-none focus:ring-primary-100 focus:border-primary-100"
                rows="2"
              />
            </label>
          </div>

          <div className="flex space-x-4">
            <label className="block text-sm font-medium text-white w-1/2">
              Paid By:
              <select
                value={paidBy}
                onChange={(e) => {
                  setPaidBy((_) => {
                    return e.target.value;
                  });
                  doEvenSplit(usersData, amount, e.target.value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-black text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100"
                required
              >
                <option value="-1">Select User</option>
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

            <label className="block text-sm font-medium text-white w-1/2">
              Amount
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount((_) => {
                    return e.target.value;
                  });
                  doEvenSplit(usersData, e.target.value, paidBy);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-black text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100"
                required
              />
            </label>
          </div>

          {/* advanced split*/}

          <div className="flex items-center space-x-5 mt-4">
            <div className="flex flex-col items-start space-y-1 mt-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-white">
                  Advanced split
                </span>
                <Switch
                  disabled
                  checked={isAdvancedSplit}
                  onChange={(e) => {
                    console.log("handletoggleadvancedsplit");
                  }}
                  className="mt-1"
                />
              </div>
              <span className="text-xs text-gray-400">Coming soon!</span>
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
                let newUsersData = usersData;
                newUsersData[index].isParticipant = e.target.checked;
                setUsersData((prevUsersData) => {
                  return newUsersData;
                });
                doEvenSplit(newUsersData, amount, paidBy);
              }}
              checked={usersData[index].isParticipant}
              className="mr-2"
            />
            <label
              htmlFor={`participant-${userData.user.user_id}`}
              className="text-white"
            >
              {userData.user.user_name}
            </label>
            {/*
            {isAdvancedSplit &&
              participants.some((p) => p.user_id === user.user_id) && (
                <input
                  type="number"
                  value={participantAmounts[user.user_id] || 0}
                  onChange={(e) => console.log("handleparticipantchange")}
                  className="ml-2 border border-blue-300 rounded-md w-20"
                />
              )}
            */}
          </div>
        ))}
      </div>

      {/* Button at the Bottom Left */}
      <div className="max-w-3xl w-full flex justify-start px-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm  rounded-md shadow-sm  text-white font-semibold bg-[#B065FF] hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
