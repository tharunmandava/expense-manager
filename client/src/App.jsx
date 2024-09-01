import axios from "axios";
import { useState,useEffect } from "react";

function App() {

  const  [users,setUsers] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:5000/api");
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

export default App;
