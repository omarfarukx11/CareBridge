'use server'
import { dbConnect } from "@/lib/dbConnect";

export async function createBooking(data) {
  try {

    const collection = dbConnect("bookings");
    
    const result = await collection.insertOne({
      ...data,
      order_date: new Date().toISOString(),
      status: "Pending"
    });

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function getUserBookings(email) {
  try {
    const bookings = await dbConnect("bookings")
      .find({ user_email: email })
      .sort({ order_date: -1 })
      .toArray();

    return bookings.map(booking => ({
      ...booking,
      _id: booking._id.toString(),
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function cancelBooking(bookingId) {
  try {
    const { ObjectId } = require("mongodb");

    const result = await dbConnect("bookings").updateOne(
      { 
        _id: new ObjectId(bookingId), 
        status: "Pending"
      },
      { 
        $set: { status: "Cancelled" } 
      }
    );

    if (result.modifiedCount === 1) {
      return { success: true, message: "Booking cancelled successfully" };
    } else {
      return { success: false, error: "Booking cannot be cancelled." };
    }
  } catch (error) {
    return { success: false, error: "Server error occurred." };
  }
}