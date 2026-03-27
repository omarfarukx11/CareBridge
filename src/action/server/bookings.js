'use server'
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";


export async function createBooking(data) {
  try {
    const collection = await dbConnect("bookings");
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
    const collection = await dbConnect("bookings");
    const bookings = await collection
      .find({ user_email: email })
      .sort({ order_date: -1 })
      .toArray();

    return bookings.map(booking => ({
      ...booking,
      _id: booking._id.toString(),
    }));
  } catch (error) {
    return [];
  }
}

export async function confirmBookingPayment(bookingId, sessionData) {
  try {
    const bookingsCollection = await dbConnect("bookings");
    const paymentsCollection = await dbConnect("paymentHistory");

    const shortId = sessionData.transactionId.substring(sessionData.transactionId.length - 10).toUpperCase();

    await paymentsCollection.insertOne({
      bookingId: bookingId,
      transactionId: `TRX-${shortId}`,
      userEmail: sessionData.email,
      amount: sessionData.amount,
      payment_date: new Date().toISOString(),
    });

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          payment_status: "Paid", 
          status: "Confirmed" 
        } 
      }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function cancelBooking(bookingId) {
  try {
    const collection = await dbConnect("bookings");
    const result = await collection.updateOne(
      { _id: new ObjectId(bookingId), status: "Pending" },
      { $set: { status: "Cancelled" } }
    );
    return { success: result.modifiedCount === 1 };
  } catch (error) {
    return { success: false };
  }
}