import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// A temporary placeholder for the Dashboard
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium transition">
            Logout
          </button>
        </div>
        <p className="text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user?.email}</span>!</p>
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-800 font-medium">Your journal entries will appear here.</p>
        </div>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

function Home() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">
          LogPulse
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your Daily Habit Journaling Application
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition">
            Login
          </Link>
          <Link to="/register" className="px-8 py-3 bg-white text-blue-600 font-medium border-2 border-blue-100 rounded-xl hover:bg-blue-50 transition">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
