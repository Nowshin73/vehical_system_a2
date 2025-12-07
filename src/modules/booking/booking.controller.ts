import { Request, Response } from "express";
import { createBookingInDB, updateBookingStatus } from "./booking.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await createBookingInDB(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });

  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const result = await updateBookingStatus(
      Number(req.params.bookingId),
      req.body.status,
      req.user!.role
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result,
    });

  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
