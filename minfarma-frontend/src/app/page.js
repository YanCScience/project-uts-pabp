'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.accessToken);
        router.push('/dashboard');
      } else {
        alert(data.message || 'Login Gagal! Cek email dan password Anda.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server backend.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-red-800 text-center">MInFarma Login</h2>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>

        <button type="submit" className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900 transition mb-4">Login</button>

        <p className="text-center text-sm text-black">Belum punya akun?{' '}
          <Link href="/register" className="text-red-700 underline font-bold hover:underline">Daftar di sini</Link>
        </p>
      </form>
    </div>
  );
}