import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      await login();
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute w-[120%] h-40 bg-brand-tertiary -skew-y-3 z-0 top-1/4"></div>
      
      <div className="immersive-card max-w-md w-full z-10">
        <h2 className="text-4xl font-black uppercase mb-6 text-center">Enter The Exhibit</h2>
        {error && <div className="bg-danger text-white p-3 font-bold border-2 border-border-strong mb-6 uppercase text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-bold mb-2 uppercase tracking-wide">Email Pass</label>
            <input 
              type="email" 
              className="immersive-input"
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-lg font-bold mb-2 uppercase tracking-wide">Security Code</label>
            <input 
              type="password" 
              className="immersive-input"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="immersive-btn w-full bg-brand-tertiary text-white border-white mt-4">
            <span>VERIFY ACCESS</span>
          </button>
        </form>
        <p className="mt-8 text-center text-lg font-medium">
          No pass yet? <Link to="/register" className="text-brand-tertiary underline font-bold hover:text-brand-quaternary">Register Here</Link>
        </p>
        <div className="mt-4 text-center">
          <Link to="/" className="text-text underline font-bold">Return to entrance</Link>
        </div>
      </div>
    </div>
  );
}
