"use server";

import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function getNearbyProfessionals(division, district, area) {
  try {
    const collection = await dbConnect("professionals");

    const professionals = await collection
      .find({
        division: division,
        district: district,
        status: "available"
      })
      .project({ name: 1, email: 1, contact: 1, experience: 1, rating: 1 })
      .toArray();

    return { success: true, data: professionals.map(p => ({ ...p, _id: p._id.toString() })) };
  } catch (error) {
    console.error("Error fetching nearby professionals:", error);
    return { success: false, message: "Failed to fetch professionals" };
  }
}

export async function assignProfessional(bookingId, professionalId) {
  try {
    const bookingsCollection = await dbConnect("bookings");
    const professionalsCollection = await dbConnect("professionals");

    const professional = await professionalsCollection.findOne({ _id: new ObjectId(professionalId) });
    if (!professional) {
      return { success: false, message: "Professional not found" };
    }

    // Update booking with assigned professional and status
    const bookingUpdate = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          assigned_professional: professionalId,
          assigned_professional_name: professional.name,
          status: "Assigned"
        }
      }
    );

    // Update professional status to assigned
    const professionalUpdate = await professionalsCollection.updateOne(
      { _id: new ObjectId(professionalId) },
      { $set: { status: "assigned" } }
    );

    if (bookingUpdate.modifiedCount > 0 && professionalUpdate.modifiedCount > 0) {
      return { success: true, message: "Professional assigned successfully" };
    } else {
      return { success: false, message: "Failed to assign professional" };
    }
  } catch (error) {
    console.error("Error assigning professional:", error);
    return { success: false, message: "Failed to assign professional" };
  }
}

export async function getProfessionalBookings(email) {
  try {
    const professionalsCollection = await dbConnect("professionals");
    const bookingsCollection = await dbConnect("bookings");
    const usersCollection = await dbConnect("users");

    const professional = await professionalsCollection.findOne({ email });
    if (!professional) {
      return { success: false, message: "Professional profile not found." };
    }

    const bookings = await bookingsCollection
      .find({ assigned_professional: professional._id.toString() })
      .sort({ order_date: -1 })
      .toArray();

    const emails = [...new Set(bookings.map((booking) => booking.user_email).filter(Boolean))];
    const users = await usersCollection.find({ email: { $in: emails } }).toArray();
    const userMap = Object.fromEntries(users.map((user) => [user.email, user]));

    const enhancedBookings = bookings.map((booking) => {
      const client = userMap[booking.user_email] || {};
      return {
        ...booking,
        _id: booking._id.toString(),
        clientName: client.name || booking.user_email,
        clientEmail: booking.user_email,
        clientPhone: client.contact || client.phone || "",
        clientAddress: client.address || booking.address || "",
        clientDivision: client.division || booking.division || "",
        clientDistrict: client.district || booking.district || "",
        clientArea: client.area || booking.area || "",
      };
    });

    return {
      success: true,
      data: enhancedBookings,
    };
  } catch (error) {
    console.error("Error fetching professional bookings:", error);
    return { success: false, message: "Failed to fetch bookings." };
  }
}

export async function advanceBookingStatus(bookingId) {
  try {
    const bookingsCollection = await dbConnect("bookings");
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
      return { success: false, message: "Booking not found." };
    }

    const statusMap = {
      Assigned: "In Progress",
      "In Progress": "Completed",
    };

    const nextStatus = statusMap[booking.status];
    if (!nextStatus) {
      return { success: false, message: "No further progress step available." };
    }

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: nextStatus } }
    );

    return { success: result.modifiedCount > 0, status: nextStatus };
  } catch (error) {
    console.error("Error advancing booking status:", error);
    return { success: false, message: "Failed to update booking status." };
  }
}
