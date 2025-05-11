// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminPassword = await argon2.hash('admin');
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Criar produtos iniciais
  const products = [
    {
      name: 'Smartphone XYZ',
      category: 'Eletrônicos',
      description: 'Um smartphone de última geração com múltiplas câmeras e processamento rápido.',
      price: 1999.99,
      quantity_stock: 50,
    },
    {
      name: 'Notebook ABC',
      category: 'Eletrônicos',
      description: 'Notebook leve e rápido para tarefas diárias e trabalho.',
      price: 3499.99,
      quantity_stock: 20,
    },
    {
      name: 'Fone de Ouvido Wireless',
      category: 'Acessórios',
      description: 'Fone de ouvido sem fio com cancelamento de ruído e longa duração de bateria.',
      price: 299.99,
      quantity_stock: 100,
    },
    {
      name: 'Smartwatch Sport',
      category: 'Wearables',
      description: 'Relógio inteligente para monitoramento de atividades físicas e saúde.',
      price: 599.99,
      quantity_stock: 35,
    },
    {
      name: 'Câmera Digital Profissional',
      category: 'Fotografia',
      description: 'Câmera DSLR com alta resolução e diversos recursos profissionais.',
      price: 4999.99,
      quantity_stock: 15,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: product,
      create: product,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });