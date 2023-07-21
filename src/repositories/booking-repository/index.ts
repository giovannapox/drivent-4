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

async function postBookings(roomId: number, userId: number){
    return prisma.booking.create({
        data: {
            roomId,
            userId
        }
    })
};

async function findRoom (roomId: number){
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
      });
};

async function checkVacancies(roomId: number){
    return prisma.booking.findMany({
        where: {
            roomId
        }
    });
};

const bookingRepository = {
    getBookings,
    findMyBooking,
    postBookings,
    findRoom,
    checkVacancies
};

export default bookingRepository;