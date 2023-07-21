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

export async function postBookings(req: AuthenticatedRequest, res: Response){
    const { userId }  = req;
    const { roomId } = req.body;

    try{
        const booking = await bookingService.postBookings(userId, roomId);
        return res.status(httpStatus.OK).send(booking.id);
    } catch (err) {
        if(err.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
        if(err.name === "ConflictError"){
            return res.sendStatus(httpStatus.FORBIDDEN);
        };
    };
};

export async function updateBookings(req: AuthenticatedRequest, res: Response){
    const { userId }  = req;
    const { roomId } = req.body;
    const { bookingId } = req.params;

    try {
        const booking = await bookingService.updateBookings(userId, roomId, Number(bookingId));
        return res.status(httpStatus.OK).send(booking.id);
    } catch (err) {
        if(err.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
        if(err.name === "ConflictError"){
            return res.sendStatus(httpStatus.FORBIDDEN);
        };
    };
};