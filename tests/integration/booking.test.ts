import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { createRandomBooking } from "../factories/booking-factory";
import httpStatus from "http-status";
import { prisma } from "@/config";

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe("get booking", () => {
    it("200 when user has a booking0", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        await createRandomBooking(user.id, room.id);
        const token = await generateValidToken(user);

        const response = await server.get("/booking").set("Authorization",  `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
    });

    it("404 when user doesn't have a booking", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const token = await generateValidToken(user);

        const response = await server.get("/booking").set("Authorization",  `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
});

describe("post booking", () => {
    it("404 if roomId doesn't exist", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);

        const response = await server.post("/booking").set("Authorization",  `Bearer ${token}`).send({roomId: 1});
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("403 if room has no vacancies", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await prisma.room.create({
            data: {
              name: '1020',
              capacity: 1,
              hotelId: hotel.id,
            },
          });;
        const token = await generateValidToken(user);

        await createRandomBooking(user.id, room.id);
        await createRandomBooking(user.id, room.id);

        const response = await server.post("/booking").set("Authorization",  `Bearer ${token}`).send({roomId: room.id});
        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("200 when create a booking", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);

        const response = await server.post("/booking").set("Authorization",  `Bearer ${token}`).send({roomId: room.id});
        expect(response.status).toBe(httpStatus.OK);
    });
});

describe("update booking", () => {
    it("404 if roomId doesn't exist", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);
        const booking = await createRandomBooking(user.id, room.id);

        const response = await server.put(`/booking/${booking.id}`).set("Authorization",  `Bearer ${token}`).send({roomId: 0});
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("403 if room has no vacancies", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await prisma.room.create({
            data: {
              name: '1020',
              capacity: 1,
              hotelId: hotel.id,
            },
          });;
        const changeRoom = await prisma.room.create({
            data: {
              name: '1020',
              capacity: 1,
              hotelId: hotel.id,
            },
        });;
        const token = await generateValidToken(user);

        await createRandomBooking(user.id, room.id);
        await createRandomBooking(user.id, room.id);

        const changingRoom = await createRandomBooking(user.id, changeRoom.id)

        const response = await server.put(`/booking/${changingRoom.id}`).set("Authorization",  `Bearer ${token}`).send({roomId: room.id});
        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("200 when the change is ok", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);
        const booking = await createRandomBooking(user.id, room.id);

        const response = await server.put(`/booking/${booking.id}`).set("Authorization",  `Bearer ${token}`).send({roomId: room.id});
        expect(response.status).toBe(httpStatus.OK);
    });
});