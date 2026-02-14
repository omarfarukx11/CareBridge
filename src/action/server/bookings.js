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