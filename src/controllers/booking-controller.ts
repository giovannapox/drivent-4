import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBookings(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try {
        const booking = await bookingService.getBookings(userId);
        return res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
    } catch (err){
        if(err.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
    };
};