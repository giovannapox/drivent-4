import { conflictError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getBookings(userId: number){
   const bookingUserId = await bookingRepository.findMyBooking(userId);

   if(!bookingUserId){
     throw notFoundError();
   };

   return bookingUserId;
};

async function postBookings (userId: number, roomId: number){
    //roomId não existente: Deve retornar status code 404.
    const roomExists = await bookingRepository.findRoom(roomId);
    if (!roomExists){
        throw notFoundError();
    };

    //roomId sem vaga: Deve retornar status code 403.
    const vacancies = await bookingRepository.checkVacancies(roomId);
    if(vacancies.length >= roomExists.capacity) {
        throw conflictError("This room has no more spaces available, please select another one.");
    };

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw notFoundError();
    };

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket || ticket.status !== "PAID" || 
    ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true){
        throw conflictError("Unable to complete, please verify all informations and try again.");
    };

    const booking = await bookingRepository.postBookings(roomId, userId);

    return booking;
};

const bookingService = {
    getBookings,
    postBookings
};

export default bookingService;