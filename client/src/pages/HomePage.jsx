import axios from "axios";
import { useState,useEffect } from "react";

const HomePage = () => {
  const  [users,setUsers] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("https://66d5d955f5859a704267a78f.mockapi.io/api/users");
    console.log(response.data[0].name);
    setUsers(response.data[0].name);
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