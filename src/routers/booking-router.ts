import { getBookings, postBookings, updateBookings } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', postBookings)
    .put('/:bookingId', updateBookings)

export { 
    bookingRouter
};