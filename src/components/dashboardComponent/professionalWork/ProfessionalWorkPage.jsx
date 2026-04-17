"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch, FaCheckCircle, FaArrowRight, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { advanceBookingStatus, getProfessionalBookings } from "@/action/server/professionals";

const ProfessionalWorkPage = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWork = async () => {
    if (status === "authenticated" && session?.user?.email) {
      setLoading(true);
      const res = await getProfessionalBookings(session.user.email);
      setBookings(res.success ? res.data : []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWork();
  }, [status, session?.user?.email, refreshKey]);

  const handleAdvanceStatus = async (bookingId) => {
    const res = await advanceBookingStatus(bookingId);
    if (res.success) {
      Swal.fire("Updated", `Work status moved to ${res.status}.`, "success");
      setRefreshKey((prev) => prev + 1);
    } else {
      Swal.fire("Error", res.message || "Could not update status.", "error");
    }
  };

  const filtered = bookings.filter((booking) =>
    booking.service_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!session || session.user.role !== "professional") {
    return (
      <div className="p-20 text-center text-slate-600">
        This area is available for professional accounts only.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">My Assigned Work</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage your assigned work list and update each job's progress in steps.</p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search work list..."
            className="input input-bordered w-full pl-10 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-1 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
        <table className="table w-full">
          <thead className="bg-slate-50/80 text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="py-4 font-bold text-[11px] uppercase tracking-wider">Service</th>
              <th className="font-bold text-[11px] uppercase tracking-wider">Client</th>
              <th className="font-bold text-[11px] uppercase tracking-wider">Contact</th>
              <th className="font-bold text-[11px] uppercase tracking-wider">Location</th>
              <th className="font-bold text-[11px] uppercase tracking-wider">Work Status</th>
              <th className="font-bold text-[11px] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No assigned work found.
                </td>
              </tr>
            ) : (
              filtered.map((booking) => {
                const nextAction =
                  booking.status === "Assigned"
                    ? { label: "Start Work", style: "btn btn-sm btn-primary", icon: <FaArrowRight /> }
                    : booking.status === "In Progress"
                    ? { label: "Mark Complete", style: "btn btn-sm btn-success", icon: <FaCheckCircle /> }
                    : null;

                const location = booking.clientAddress
                  ? booking.clientAddress
                  : [booking.clientArea, booking.clientDistrict, booking.clientDivision].filter(Boolean).join(", ");

                return (
                  <tr key={booking._id} className="border-b last:border-none hover:bg-slate-50 transition-colors">
                    <td className="py-5">
                      <div className="font-bold text-slate-800">{booking.service_title}</div>
                      <div className="text-xs text-slate-400 mt-1">{booking.booking_type || "Service"}</div>
                    </td>
                    <td>
                      <div className="text-sm font-semibold">{booking.clientName || booking.user_email}</div>
                      <div className="text-xs text-slate-400 mt-1">{booking.clientEmail}</div>
                    </td>
                    <td className="text-sm text-slate-700">
                      {booking.clientPhone || "No phone available"}
                    </td>
                    <td className="text-sm text-slate-700">
                      {location || "No location provided"}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          booking.status === "Completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : booking.status === "In Progress"
                            ? "bg-blue-100 text-blue-600"
                            : booking.status === "Assigned"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>
                    <td className="text-right">
                      {nextAction ? (
                        <button onClick={() => handleAdvanceStatus(booking._id)} className={`${nextAction.style} rounded-xl normal-case`}>
                          {nextAction.icon} {nextAction.label}
                        </button>
                      ) : (
                        <div className="text-sm font-bold uppercase text-slate-500">
                          {booking.status === "Completed" ? "Completed" : booking.status || "No action"}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessionalWorkPage;
