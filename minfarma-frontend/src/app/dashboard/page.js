'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [medicines, setMedicines] = useState([]);
    const [form, setForm] = useState({ name: '', category: '', stock: '', price: '' });
    const [editId, setEditId] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchMedicines();

        const timer = setInterval(() => {
            const now = new Date();
            const formatted = now.toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            setCurrentTime(formatted + ' WIB');
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchMedicines = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return router.push('/');
        }

        try {
            const res = await fetch('http://localhost:5000/api/medicines', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMedicines(await res.json());
            } else {
                localStorage.removeItem('token');
                router.push('/');
            }
        } catch (error) {
            console.error('Gagal mengambil data obat', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const url = editId
            ? `http://localhost:5000/api/medicines/${editId}`
            : 'http://localhost:5000/api/medicines';
        const method = editId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        setForm({ name: '', category: '', stock: '', price: '' });
        setEditId(null);
        fetchMedicines();
    };

    const handleEditClick = (medicine) => {
        setForm({
            name: medicine.name,
            category: medicine.category,
            stock: medicine.stock,
            price: medicine.price
        });
        setEditId(medicine.id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/medicines/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchMedicines();
    };

    const handleLogout = async () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex-grow">

                <div className="flex justify-between items-center bg-red-900 text-white p-4 rounded-t-lg shadow-sm">
                    <h1 className="text-xl font-bold">Dashboard MInFarma</h1>
                    <button onClick={handleLogout} className="bg-white text-red-900 px-4 py-2 rounded hover:bg-gray-200 transition font-bold shadow-sm">Logout</button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md flex flex-wrap md:flex-nowrap gap-4 mt-4 rounded-lg">
                    <input type="text" placeholder="Nama Obat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full md:w-[35%] focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
                    <input type="text" placeholder="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 rounded w-full md:w-[25%] focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
                    <input type="number" placeholder="Stok" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border p-2 rounded w-full md:w-[10%] focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>
                    <input type="number" placeholder="Harga" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 rounded w-full md:w-[15%] focus:outline-none focus:ring-2 focus:ring-red-700 text-black" required/>

                    <button type="submit" className={`w-full md:w-[15%] ${editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-800 hover:bg-red-900'} text-white px-4 py-2 rounded font-bold transition shadow-sm`}>
                        {editId ? 'Update' : 'Tambah'}
                    </button>

                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setForm({ name: '', category: '', stock: '', price: '' }); }} className="w-full md:w-[10%] bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold transition shadow-sm">Batal</button>
                    )}
                </form>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto mt-6">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-red-50 text-red-900">
                            <tr>
                                <th className="border border-gray-300 p-4 text-center font-bold w-[35%]">Nama Obat</th>
                                <th className="border border-gray-300 p-4 text-center font-bold w-[25%]">Kategori</th>
                                <th className="border border-gray-300 p-4 text-center font-bold w-[10%]">Stok</th>
                                <th className="border border-gray-300 p-4 text-center font-bold w-[15%]">Harga</th>
                                <th className="border border-gray-300 p-4 text-center font-bold w-[15%]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.length > 0 ? (
                                medicines.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition">
                                        <td className="border border-gray-300 p-4 text-center text-black font-medium">{m.name}</td>
                                        <td className="border border-gray-300 p-4 text-center text-black">{m.category}</td>
                                        <td className="border border-gray-300 p-4 text-center text-black">{m.stock}</td>
                                        <td className="border border-gray-300 p-4 text-left text-black">Rp {m.price}</td>
                                        <td className="border border-gray-300 p-4 text-center text-black">
                                            <button onClick={() => handleEditClick(m)} className="text-yellow-600 hover:text-yellow-800 font-bold transition">Edit</button>
                                            <span style={{ color: '#9ca3af' }}>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;</span>

                                            <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800 font-bold transition">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border border-gray-300 p-4 text-center text-gray-500">Tidak ada data obat.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="text-center mt-8 text-red-900 text-base font-bold pb-8">
                    {currentTime ? `Akses saat ini: ${currentTime}` : 'Memuat waktu...'}
                </div>

            </div>
        </div>
    );
}