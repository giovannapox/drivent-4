import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getBookings(userId: number){
   const bookingUserId = await bookingRepository.findMyBooking(userId);

   if(!bookingUserId){
     throw notFoundError();
   };

   return bookingUserId;
};

const bookingService = {
    getBookings
};

export default bookingService;