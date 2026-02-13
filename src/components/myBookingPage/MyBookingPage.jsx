"use client";
import React from "react";
import { FaClock, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const MyBookingPage = () => {

  const dummyBookings = [
    {
      _id: "1",
      service_title: "Professional Nursing Care",
      city: "Dhaka",
      area: "Dhanmondi",
      duration: "12",
      total_cost: 1500,
      status: "Pending",
      created_at: "2024-05-20",
    },
    {
      _id: "2",
      service_title: "Elderly Companion",
      city: "Chittagong",
      area: "Halishahar",
      duration: "24",
      total_cost: 3000,
      status: "Completed",
      created_at: "2024-05-18",
    },
    {
      _id: "3",
      service_title: "Post-Surgical Care",
      city: "Dhaka",
      area: "Gulshan",
      duration: "8",
      total_cost: 1200,
      status: "Processing",
      created_at: "2024-05-15",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 mt-1">Review your service history and current appointments.</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-slate-50/50 text-slate-600 border-b border-slate-100">
                <th className="py-6 px-8 font-bold uppercase text-xs tracking-wider text-left">Service Details</th>
                <th className="font-bold uppercase text-xs tracking-wider text-left">Location</th>
                <th className="font-bold uppercase text-xs tracking-wider text-left">Duration</th>
                <th className="font-bold uppercase text-xs tracking-wider text-left">Total Bill</th>
                <th className="font-bold uppercase text-xs tracking-wider text-left">Status</th>
                <th className="font-bold uppercase text-xs tracking-wider text-right px-8">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-50">
              {dummyBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-base group-hover:text-primary transition-colors">
                        {booking.service_title}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                        <FaCalendarAlt className="text-[10px]" />
                        {new Date(booking.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                        <FaMapMarkerAlt size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{booking.area}</span>
                        <span className="text-xs text-slate-400">{booking.city}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-slate-300" />
                      <span className="text-sm font-medium text-slate-600">{booking.duration} Hours</span>
                    </div>
                  </td>

                  <td>
                    <span className="text-lg font-black text-slate-800">৳{booking.total_cost}</span>
                  </td>

                  <td>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide
                      ${
                        booking.status === "Pending"
                          ? "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200"
                          : booking.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200"
                          : "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200"
                      }`}
                    >
                      {booking.status === "Pending" && <FaHourglassHalf />}
                      {booking.status === "Completed" && <FaCheckCircle />}
                      {booking.status}
                    </div>
                  </td>

                  <td className="px-8 text-right">
                    <button className="btn btn-ghost btn-sm text-primary hover:bg-primary/5 capitalize font-bold rounded-xl">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookingPage;