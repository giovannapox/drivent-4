import { prisma } from "@/config";

export async function createRandomBooking(userId: number, roomId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });
};