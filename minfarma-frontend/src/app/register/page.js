'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (res.ok) {
        alert('Registrasi Berhasil! Silakan Login dengan akun tersebut.');
        router.push('/'); 
      } else {
        alert('Registrasi Gagal! Email mungkin sudah digunakan.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server backend.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-red-800 text-center">Daftar Admin MInFarma</h2>
        
        <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
        
        <button type="submit" className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900 transition mb-4">Register</button>
        
        <p className="text-center text-sm text-black">Sudah punya akun?{' '}
          <Link href="/" className="text-red-700 font-bold hover:underline">Login di sini</Link>
        </p>
      </form>
    </div>
  );
}