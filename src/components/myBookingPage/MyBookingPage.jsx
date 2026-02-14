"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaClock, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

import Swal from "sweetalert2";
import { cancelBooking, getUserBookings } from "@/action/server/bookings";


const MyBookingPage = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (session?.user?.email) {
      const data = await getUserBookings(session.user.email);
      setBookings(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this cancellation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", 
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, cancel it!",
      customClass: {
        popup: 'rounded-[30px]',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3'
      }
    });

    if (confirm.isConfirmed) {
      Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });
      
      const result = await cancelBooking(id);
      
      if (result.success) {
        Swal.fire("Cancelled!", result.message, "success");
        fetchBookings(); 
      } else {
        Swal.fire("Error", result.error, "error");
      }
    }
  };

  if (loading) return <div className="text-center py-20"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">My Bookings</h1>
        <p className="text-slate-500">Manage your appointments and track status.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="py-6 px-8 uppercase text-[10px] tracking-widest">Service</th>
                <th className="uppercase text-[10px] tracking-widest">Schedule</th>
                <th className="uppercase text-[10px] tracking-widest">Total</th>
                <th className="uppercase text-[10px] tracking-widest">Status</th>
                <th className="uppercase text-[10px] tracking-widest text-right px-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="py-6 px-8">
                    <span className="font-bold text-slate-800">{booking.service_title}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{booking.area}</p>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-600 flex flex-col">
                      <span>{booking.startDate}</span>
                      <span className="text-slate-400 font-medium">{booking.duration} {booking.booking_type}</span>
                    </div>
                  </td>
                  <td><span className="font-black text-slate-800">৳{booking.total_cost}</span></td>
                  <td>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider
                      ${booking.status === "Pending" ? "bg-amber-100 text-amber-600" : 
                        booking.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                      {booking.status}
                    </div>
                  </td>
                  <td className="px-8 text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === "Pending" && (
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 capitalize font-bold rounded-xl"
                        >
                          <FaTimesCircle className="mr-1" /> Cancel
                        </button>
                      )}
                      {booking.status === "Cancelled" && (
                        <button 
                          className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 capitalize font-bold rounded-xl"
                        > Cancelled
                        </button>
                      )}
                    </div>
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