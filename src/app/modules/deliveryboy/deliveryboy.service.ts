import { OrderStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const deliveryService = {
  
  // 1) Get assigned orders
  async getAssignedOrders(deliveryBoyId: string) {
    return prisma.order.findMany({
      where: { deliveryid: deliveryBoyId },
      include: { OrderItem: true, User: true, Vendor: true },
    });
  },

  // 2) Pickup order
  async pickupOrder(orderId: string, deliveryBoyId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new Error("Order not found");
    if (order.deliveryid !== deliveryBoyId) throw new Error("Unauthorized");

    return prisma.order.update({
      where: { id: orderId },
      data: { status: "PICKED" },
    });
  },

  // 3) Update status
    async updateStatus(orderId: string, deliveryBoyId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new Error("Order not found");
  if (order.deliveryid !== deliveryBoyId) throw new Error("Unauthorized");

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
},

  // 4) Upload Proof (image)
//   async uploadProof(orderId: string, deliveryBoyId: string, url: string) {
//     const order = await prisma.order.findUnique({ where: { id: orderId } });

//     if (!order) throw new Error("Order not found");
//     if (order.deliveryid !== deliveryBoyId) throw new Error("Unauthorized");

//     // ধরে নিচ্ছি proofUrl যোগ করতে চাইলে Order model-এ field add করা লাগবে
//     return prisma.order.update({
//       where: { id: orderId },
//       data: { status: "DELIVERED" }, // delivered after proof
//     });
//   },

  // 5) Update Live Location
  async updateLocation(deliveryBoyId: string, location: string) {
    return prisma.deliveryBoy.update({
      where: { id: deliveryBoyId },
      data: { area: location },
    });
  },

  // 6) Chat
  async sendChat(senderid: string, receiverid: string, message: string) {
    return prisma.chatMessage.create({
      data: { senderid, receiverid, message },
    });
  }
};
