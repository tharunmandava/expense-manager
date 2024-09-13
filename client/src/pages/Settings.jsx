import ManageNavBar from "../components/ManageNavBar";

const Settings = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black py-4">
      <ManageNavBar />

      <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
        <form onSubmit={console.log("form")} className="space-y-6">
          <div className="flex space-x-4">
            <label className="block text-sm font-medium text-white w-1/2">
              Group name
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black"
                required
              />
            </label>

            <label className="block text-sm font-medium text-white w-1/2">
              Currency
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-white">
            Group information
            <textarea
              placeholder=""
              className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-white bg-black"
              rows="5"
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default Settings;
