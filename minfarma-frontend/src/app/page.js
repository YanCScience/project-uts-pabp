'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      router.push('/dashboard');
    } else {
      alert('Login Gagal!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-red-800 text-center">MInFarma Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        <button type="submit" className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900 transition">Login</button>
      </form>
    </div>
  );
}