import axios from "axios";
import ManageNavBar from "../components/ManageNavBar";

const More = () => {
  
  const API_URL = import.meta.env.VITE_API_URL;

    return (
      <div className="min-h-screen p-4">
    <div className="flex flex-col items-center">
      {/* Wrapper for aligning group name and ManageNavBar */}
      <div className="w-full max-w-3xl">
        <ManageNavBar />
      </div>
        COMING SOON!
      </div>
      </div>
    )
  }
  
  export default More;
  