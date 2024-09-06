import axios from "axios";
import { useState,useEffect } from "react";

const HomePage = () => {
  const  [user,setUser] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchAPI = async () => {
    const response = await axios.get(`${API_URL}/users/3`);
    console.log(response);
    setUser(response.data.name);
  };

  useEffect(() => {
    fetchAPI();
  },[])

  return (
    <h1 className="text-3xl font-bold underline">
      Hello, {user}
    </h1>
  )
}

export default HomePage;
