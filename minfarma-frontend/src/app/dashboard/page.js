'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', stock: '', price: '' });
  const [editId, setEditId] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/');
    const res = await fetch('http://localhost:5000/api/medicines', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setMedicines(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/medicines/${editId}` : 'http://localhost:5000/api/medicines';
    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    
    setForm({ name: '', category: '', stock: '', price: '' });
    setEditId(null);
    fetchMedicines();
  };

  const handleEditClick = (medicine) => {
    setForm({ name: medicine.name, category: medicine.category, stock: medicine.stock, price: medicine.price });
    setEditId(medicine.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/medicines/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchMedicines();
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-red-900 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">Dashboard MInFarma</h1>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition">Logout</button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md mb-6 flex gap-4 mt-4 rounded-lg">
          <input type="text" placeholder="Nama Obat" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
          <input type="text" placeholder="Kategori" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
          <input type="number" placeholder="Stok" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} className="border p-2 rounded w-24 focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
          <input type="number" placeholder="Harga" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
          <button type="submit" className={`${editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-800 hover:bg-red-900'} text-white px-4 rounded transition`}>
            {editId ? 'Update' : 'Tambah'}
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-red-50 text-red-900">
              <tr>
                <th className="p-4 border-b">Nama Obat</th>
                <th className="p-4 border-b">Kategori</th>
                <th className="p-4 border-b">Stok</th>
                <th className="p-4 border-b">Harga</th>
                <th className="p-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b text-black">{m.name}</td>
                  <td className="p-4 border-b text-black">{m.category}</td>
                  <td className="p-4 border-b text-black">{m.stock}</td>
                  <td className="p-4 border-b text-black">Rp {m.price}</td>
                  <td className="p-4 border-b text-black flex gap-2">
                    <button onClick={() => handleEditClick(m)} className="text-yellow-600 hover:text-yellow-800 font-bold transition">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800 font-bold transition">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}