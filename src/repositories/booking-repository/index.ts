import { prisma } from "@/config";

async function getBookings(bookingId: number){
    return prisma.booking.findFirst({
        where: {
            id: bookingId
        }
    })
};

async function findMyBooking(userId: number){
    return prisma.booking.findFirst({
        where: {
            userId
        },
        include: {
            Room: true
        }
    })
};

const bookingRepository = {
    getBookings,
    findMyBooking,
};

export default bookingRepository;