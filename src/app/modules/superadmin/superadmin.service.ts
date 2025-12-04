import prisma from "../../utils/prisma";

export const superAdminService = {
  // Create new admin user
  async createAdmin(data: { userId: string }) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new Error( "User not found");

    if (user.role !== "USER") {
      throw new Error("This user already has elevated role");
    }

    const updated = await prisma.user.update({
      where: { id: data.userId },
      data: { role: "ADMIN" },
    });

    return updated;
  },

  // Update role of any user
  async updateUserRole(id: string, role: "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "MANAGER" | "DELIVERY_BOY") {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error( "User not found");

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return updated;
  },

  // Update commission rate
  async updateCommission(rate: number) {
    if (rate < 0 || rate > 100) {
      throw new Error( "Commission must be 0–100%");
    }

    const commission = await prisma.systemConfig.upsert({
      where: { key: "commission" },
      update: { value: rate.toString() },
      create: { key: "commission", value: rate.toString() },
    });

    return commission;
  },
};
