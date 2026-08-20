import React from "react";

const Settings = () => {
  return (
    <div>
      {" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-orange-500">
            Manage your store and account preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
