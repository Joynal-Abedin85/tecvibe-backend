import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ShopService = {
  getProducts: async () => {
    return prisma.product.findMany({
      where: { status: "APPROVED" },
      include: {
        productimages: true,
        category: true,
        brand: true,
        verdor: { select: { shopname: true } },
      },
    });
  },

  // GET /api/products/:id
  getProductById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        productimages: true,
        category: true,
        brand: true,
        reviews: true,
        questions: true,
        verdor: { select: { shopname: true } },
      },
    });
  },

  // GET /api/products/search?q=phone
  searchProducts: async (q: string) => {
    return prisma.product.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        productimages: true,
      },
    });
  },

  getCategories: async () => {
    return prisma.category.findMany();
  },

  getBrands: async () => {
    return prisma.brand.findMany();
  },
};
