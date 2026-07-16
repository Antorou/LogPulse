import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">
          LogPulse
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your Daily Habit Journaling Application
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Login
          </button>
          <button className="px-6 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-gray-50 transition">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
