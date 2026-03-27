"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCalendarAlt, FaCheckCircle, FaCreditCard, FaSearch, FaTrashAlt, FaClock } from "react-icons/fa";
import Swal from "sweetalert2";
import { cancelBooking, confirmBookingPayment, getUserBookings } from "@/action/server/bookings";
import { createCheckoutSession } from "@/action/server/payment";

const BookingContent = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (session?.user?.email) {
      const data = await getUserBookings(session.user.email);
      setBookings(data || []);
      setLoading(false);
    }
  };

  useEffect(() => { if (session) fetchBookings(); }, [session]);

  useEffect(() => {
    const success = searchParams.get("success");
    const bId = searchParams.get("bookingId");

    const verify = async () => {
      if (success === "true" && bId && bookings.length > 0) {
        const target = bookings.find(b => b._id === bId);
        // যদি পেমেন্ট স্ট্যাটাস Paid না থাকে তবেই আপডেট হবে
        if (target && target.payment_status !== "Paid") {
          Swal.fire({ title: "Processing Payment...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

          const res = await confirmBookingPayment(bId, {
            transactionId: searchParams.get("session_id"),
            email: session.user.email,
            name: session.user.name,
            amount: target.total_cost,
            service_title: target.service_title
          });

          if (res.success) {
            Swal.fire("Success", "Payment confirmed & Service activated!", "success");
            fetchBookings();
            router.replace("/dashboard/myBooking");
          }
        }
      }
    };
    verify();
  }, [searchParams, bookings]);

  const filtered = bookings.filter(b => b.service_title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center py-24"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Bookings</h1>
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search your services..." 
            className="input input-bordered w-full pl-10 rounded-xl bg-white focus:ring-1 focus:ring-primary"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-100 rounded-xl shadow-sm">
        <table className="table w-full">
          <thead className="bg-slate-50/80 text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="py-4 font-bold text-[11px] uppercase tracking-wider">Service Details</th>
              <th className="font-bold text-[11px] uppercase tracking-wider text-center">Service Status</th>
              <th className="font-bold text-[11px] uppercase tracking-wider text-center">Payment</th>
              <th className="font-bold text-[11px] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.map((booking) => (
              <tr key={booking._id} className="border-b last:border-none hover:bg-slate-50/30 transition-colors">
                <td className="py-5">
                  <div className="font-bold text-slate-800">{booking.service_title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                    <FaCalendarAlt /> {booking.startDate} • ৳{booking.total_cost}
                  </div>
                </td>
                <td className="text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {booking.status || 'Pending'}
                  </span>
                </td>
                <td className="text-center">
                   <div className={`badge badge-sm border-none font-bold py-3 px-4 rounded-lg ${
                    booking.payment_status === 'Paid' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                   }`}>
                    {booking.payment_status === 'Paid' ? 'PAID' : 'UNPAID'}
                   </div>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    {booking.payment_status !== "Paid" && booking.status !== "Cancelled" ? (
                      <>
                        <button onClick={() => createCheckoutSession(booking)} className="btn btn-sm btn-primary rounded-xl px-2 normal-case font-bold shadow-sm shadow-primary/20">
                          <FaCreditCard />
                        </button>
                        <button onClick={() => cancelBooking(booking._id).then(fetchBookings)} className="btn btn-sm btn-ghost text-black hover:text-red-500 rounded-xl">
                          <FaTrashAlt />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs uppercase px-3 py-1">
                        <FaCheckCircle /> Completed
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function MyBookingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-400 font-medium">Loading your dashboard...</div>}>
      <BookingContent />
    </Suspense>
  );
}