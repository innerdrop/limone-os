const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.taller.deleteMany({ where: { nombre: { contains: 'verano 2026', mode: 'insensitive' } } })
  .then(r => console.log('Eliminados:', r.count))
  .catch(e => console.log('Error:', e.message))
  .finally(() => prisma.());