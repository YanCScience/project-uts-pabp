const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Akses ditolak. Token hilang." });
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid." });
    req.userId = decoded.id;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({ data: { name, email, passwordHash } });
    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (err) {
    res.status(400).json({ message: "Email sudah digunakan" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ message: "Email atau password salah" });
  }
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
  res.json({ accessToken });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({ message: "Token berhasil diperbarui" });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: "Logout berhasil" });
});

app.get('/api/medicines', verifyToken, async (req, res) => {
  const medicines = await prisma.medicine.findMany();
  res.json(medicines);
});

app.post('/api/medicines', verifyToken, async (req, res) => {
  const { name, category, stock, price } = req.body;
  const medicine = await prisma.medicine.create({
    data: { name, category, stock: parseInt(stock), price: parseFloat(price) }
  });
  res.status(201).json(medicine);
});

app.put('/api/medicines/:id', verifyToken, async (req, res) => {
  const { name, category, stock, price } = req.body;
  try {
    const medicine = await prisma.medicine.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, stock: parseInt(stock), price: parseFloat(price) }
    });
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: "Gagal update data" });
  }
});

app.delete('/api/medicines/:id', verifyToken, async (req, res) => {
  await prisma.medicine.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Obat dihapus" });
});

app.listen(process.env.PORT, () => console.log(`Backend jalan di port ${process.env.PORT}`));