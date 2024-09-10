import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState(['']);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleAddMember = () => {
    setMembers([...members, '']);
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
    try {
      const response = await axios.post(`${API_URL}/groups/`, {
        group_name: name,
        group_currency: currency,
        group_description: description,
        members: members,
      });
      console.log('Group created:', response.data);
      const groupId = response.data.id;
      navigate(`/groups/${groupId}/expenses`);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create a Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Group Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Group Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Group Currency
          </label>
          <input
            type="text"
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="INR, USD, etc."
            required
          />
        </div>

        {/* Group Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Group Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter group description"
            required
          />
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Members</label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
