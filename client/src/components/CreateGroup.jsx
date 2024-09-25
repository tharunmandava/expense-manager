import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(isLoading) return;

    setIsSubmitted(true);

    if (name == "" || currency == "" || name.length > 255 || currency.length > 5) return;

    const hasEmptyMembers = members.some(member => member.trim() === "" || member.length > 255);
    

    if(hasEmptyMembers){
      alert("Please ensure all member names are filled and within 255 characters.");
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/groups/`, {
        group_name: name,
        group_currency: currency,
        group_description: description,
        members: members,
      });
      console.log("Group created:", response.data);
      const groupId = response.data.id;
      navigate(`/groups/${groupId}/expenses`);
    } catch (error) {
      console.error("Error creating group:", error);
    } finally{
      setLoading(false);
    }
  };

  //----------------------------------------------------------------------------------

  return (
    <div className="flex flex-col items-center min-h-screen py-4">
      {/* Green Section */}
      <div className=" border-0 bg-gray-800  rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Group Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flex container for Group Name and Group Currency */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Group Name */}
            <div className="flex-1">
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${isSubmitted && name === "" || name.length > 255 ? "text-red-500" : "text-white" }`}
              >
                Group Name {name.length > 255 && " (max 255 characters)"}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`bg-black mt-1 block w-full px-3 py-2 border ${
                  isSubmitted && name === "" || name.length > 255 ? "border-red-500" : "border-gray-700"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-100 focus:border-primary-100 sm:text-sm`}
                required
              />
            </div>

            {/* Group Currency */}
            <div className="flex-1">
              <label
                htmlFor="currency"
                className={`block text-sm font-medium ${isSubmitted && currency == "" || currency.length > 5 ? "text-red-500" : "text-white" }`}
              >
                Group Currency {currency.length > 5 && " (max 5 characters)"}
              </label>
              <input
                type="text"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`bg-black mt-1 block w-full px-3 py-2 border ${
                  isSubmitted && currency == "" || currency.length > 5 ? "border-red-500" : "border-gray-700"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-100 focus:border-primary-100 sm:text-sm`}
                placeholder="INR, USD, etc."
                required
              />
            </div>
          </div>

          {/* Group Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white"
            >
              Group Information
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="8"
              className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-100 focus:border-primary-100 sm:text-sm"
              placeholder="Information relevant to the group"
            />
          </div>
        </form>
      </div>

      {/* Blue Section */}
      <div className="bg-gray-800 border-0 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <div>
          <label className="block text-sm font-medium text-white">
            Members
          </label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-black rounded-md shadow-sm focus:outline-none focus:ring-primary-100 focus:border-primary-100 sm:text-sm"
                placeholder={`Member ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveMember(index)}
                className="bg-red-500 text-white font-semibold py-1 px-2 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMember}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Group...' : 'Create Group'}
      </button>
    </div>
  );
};

export default CreateGroup;
