import axios from "axios";

export const fetchAndStoreGroup = async (API_URL, id, setGroup) => {
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
