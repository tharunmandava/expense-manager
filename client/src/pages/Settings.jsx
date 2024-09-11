import { Input } from "antd";

const Settings = () => {
  return (
    <div className="max-w-screen-md mx-auto my-4">
      <div className="bg-black my-4 text-white border-2 border-gray-50 rounded-lg flex flex-col">
        <h3 className="text-2xl mx-4 mt-4 font-semibold">Group info</h3>
        <div className="flex flex-row">
          <div className="basis-1/2 m-4">
            <label>Group name</label>
            <Input className="bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 text-white my-2" />
          </div>
          <div className="basis-1/2 m-4">
            <label>Currency</label>
            <Input className="bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 text-white my-2" />
          </div>
        </div>
        <div className="m-4">
          <label>Description</label>
          <Input className="bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 text-white my-2" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
