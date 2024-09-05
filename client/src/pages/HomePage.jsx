import axios from "axios";
import { useState,useEffect } from "react";

const HomePage = () => {
  const  [users,setUsers] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("https://g2m4e.wiremockapi.cloud/api/user/3");
    console.log(response);
    setUsers(response.data.name);
  };

  useEffect(() => {
    fetchAPI();
  },[])

  return (
    <h1 className="text-3xl font-bold underline">
      Hello, {users}
    </h1>
  )
}

export default HomePage
