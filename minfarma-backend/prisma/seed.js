const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@minfarma.com' },
        update: {
            passwordHash: passwordHash,
            name: 'Admin Apotek'
        },
        create: {
            email: 'admin@minfarma.com',
            name: 'Admin Apotek',
            passwordHash: passwordHash,
        },
    });

    console.log('Akun Admin terbuat:', admin.email, ' | Password: admin123');

    await prisma.medicine.deleteMany();

    const dummyMedicines = [
        { name: 'Amoxicillin 500mg', category: 'Antibiotik', stock: 100, price: 8500 },
        { name: 'Antasida Doen', category: 'Obat Lambung', stock: 250, price: 4000 },
        { name: 'Cetirizine 10mg', category: 'Antialergi', stock: 80, price: 12000 },
        { name: 'OBH Combi Plus 100ml', category: 'Obat Batuk', stock: 45, price: 21000 },
        { name: 'Vitamin C 1000mg', category: 'Suplemen', stock: 200, price: 15000 },
        { name: 'Oskadon', category: 'Obat Sakit Kepala', stock: 120, price: 3500 },
        { name: 'Betadine Cair 15ml', category: 'Antiseptik', stock: 60, price: 18000 },
        { name: 'Neurobion Forte', category: 'Vitamin Saraf', stock: 90, price: 35000 },
        { name: 'Sanmol Sirup', category: 'Obat Demam Anak', stock: 40, price: 25000 },
    ];

    for (const med of dummyMedicines) {
        await prisma.medicine.create({
            data: med,
        });
    }

    console.log('10 Data Obat Dummy berhasil dimasukkan ke MInFarma!');
} 

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });