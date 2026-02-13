import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";




export async function POST(request) {
  try {
    const booking = await request.json();
    const collection = dbConnect("bookings");
    const result = await collection.insertOne(booking);

    return NextResponse.json({ 
      success: true, 
      message: "Booking saved to MongoDB",
      id: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  } finally {

  }
}