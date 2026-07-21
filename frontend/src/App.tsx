import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NewEntry from './pages/NewEntry';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blocks */}
      <div className="absolute w-64 h-64 bg-brand-tertiary right-0 md:right-32 top-20 -skew-y-6 hidden sm:block"></div>
      <div className="absolute w-48 h-48 bg-brand-quaternary left-0 md:left-32 bottom-20 rotate-12 hidden sm:block"></div>
      
      <div className="immersive-card max-w-xl w-full text-center z-10 mt-12 mb-12">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-4">
          LogPulse
        </h1>
        <p className="text-xl md:text-2xl font-medium mb-10 leading-snug uppercase max-w-sm mx-auto">
          Track Your Habits. Log Your Evolution.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
          <Link to="/login" className="immersive-btn bg-brand-quaternary text-white border-white">
            <span>ENTER THE EXHIBIT</span>
          </Link>
          <Link to="/register" className="immersive-btn">
            <span>REGISTER PASS</span>
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
      <Route 
        path="/new" 
        element={
          <ProtectedRoute>
            <NewEntry />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
