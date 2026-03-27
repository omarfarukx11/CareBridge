'use server'
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// ১. নতুন বুকিং তৈরি
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

// ২. ইউজারের বুকিং লিস্ট ফেচ করা
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

// ৩. পেমেন্ট কনফার্মেশন এবং হিস্ট্রি সেভ (এটিই স্ট্যাটাস আপডেট করবে)
export async function confirmBookingPayment(bookingId, sessionData) {
  try {
    const bookingsCollection = await dbConnect("bookings");
    const paymentsCollection = await dbConnect("paymentHistory");

    // ছোট ট্রানজ্যাকশন আইডি (শেষ ১০ ডিজিট)
    const shortId = sessionData.transactionId.substring(sessionData.transactionId.length - 10).toUpperCase();

    // পেমেন্ট রেকর্ড সেভ করা
    await paymentsCollection.insertOne({
      bookingId: bookingId,
      transactionId: `TRX-${shortId}`,
      userEmail: sessionData.email,
      amount: sessionData.amount,
      payment_date: new Date().toISOString(),
    });

    // স্ট্যাটাস আপডেট: পেমেন্ট "Paid" এবং সার্ভিস "Confirmed"
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

// ৪. বুকিং ক্যানসেল
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