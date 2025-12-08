import { Request, Response } from "express";
import { bookingService } from "./booking.service";


const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const result = await bookingService.createBooking(req.body, user);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const result = await bookingService.getBookings(user);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const bookingId = req.params.bookingId!;

    const result = await bookingService.updateBooking(bookingId, user);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data ?? null,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking
}
