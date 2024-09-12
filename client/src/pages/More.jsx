import axios from "axios";
import ManageNavBar from "../components/ManageNavBar";

const More = () => {
  
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchusers = async () =>{
    try {
     const res = await axios.get(`${API_URL}/users/list-all`) 
     const res_json = JSON.stringify(res.data);
     localStorage.setItem("users", res_json);
     console.log("running fetch users!")
    } catch (error) {
     console.log("coudnt fetch users",error); 
    }
  }

  const test = () => {
    const storedData = localStorage.getItem("users");
    if (storedData) {
      console.log(JSON.parse(storedData));
    }
  }



  

    return (
      <div className="min-h-screen p-4">
        <ManageNavBar />
        <button onClick={fetchusers}>click me</button>
        <button onClick={test}>localstorage</button>
      </div>
    )
  }
  
  export default More
  