import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAndStoreGroup } from '../utils/fetchAndStoreGroup'; // import the utility function

const FetchAndStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null); // State to store the group data
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch the group and store it when component mounts or when the ID changes
    fetchAndStoreGroup(API_URL, id, setGroup);

    // Redirect logic
    if (window.location.pathname === `/groups/${id}`) {
      navigate(`/groups/${id}/expenses`);
    }
  }, [id, navigate, API_URL]);

  return (
    <>
        <Outlet />
    </>
  );
};

export default FetchAndStore;
