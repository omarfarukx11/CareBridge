"use client";
import React, { useEffect, useState, Suspense } from "react";
import { FaCalendarAlt, FaSearch, FaTrashAlt, FaUser, FaChevronLeft, FaChevronRight, FaFilter, FaSortAmountDown, FaWallet, FaUserMd } from "react-icons/fa";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { getAllBookings } from "@/action/server/bookings";
import { getNearbyProfessionals, assignProfessional } from "@/action/server/professionals";

const AllBookingsContent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for Pagination, Filtering, and Sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all"); // New State
  const [sortConfig, setSortConfig] = useState({ field: "order_date", order: -1 });
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";

  // State for Assign Professional Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    const res = await getAllBookings({ 
        page, 
        limit: 20, 
        statusFilter, 
        paymentFilter, // Pass to server
        sortField: sortConfig.field, 
        sortOrder: sortConfig.order 
    });
    if (res.success) {
      setBookings(res.data);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  };

  // Re-fetch when any control changes
  useEffect(() => { fetchAllData(); }, [page, statusFilter, paymentFilter, sortConfig]);

  const handleAssignProfessional = async (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    // Fetch nearby professionals
    const res = await getNearbyProfessionals(booking.division, booking.district, booking.area);
    if (res.success) {
      setProfessionals(res.data);
    } else {
      alert("Failed to fetch professionals");
    }
  };

  const handleAssign = async (professionalId) => {
    setAssigning(true);
    const res = await assignProfessional(selectedBooking._id, professionalId);
    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Professional assigned successfully",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      setShowModal(false);
      fetchAllData(); // Refresh bookings
    } else {
      Swal.fire({
        icon: "error",
        title: "Assignment failed",
        text: res.message || "Failed to assign professional",
      });
    }
    setAssigning(false);
  };

  const filtered = bookings.filter(b => 
    b.service_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Admin: All Bookings</h1>
        
        {/* Responsive Control Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search email/service..." 
              className="input input-bordered w-full pl-10 rounded-xl bg-slate-50 border-none focus:bg-white transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Service Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 text-sm" />
            <select 
                className="select select-bordered select-sm w-full rounded-xl border-slate-200"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
                <option value="all">All Service Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter - NEW */}
          <div className="flex items-center gap-2">
            <FaWallet className="text-slate-400 text-sm" />
            <select 
                className="select select-bordered select-sm w-full rounded-xl border-slate-200"
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            >
                <option value="all">All Payments</option>
                <option value="Paid">Paid Only</option>
                <option value="Unpaid">Unpaid Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-slate-400 text-sm" />
            <select 
                className="select select-bordered select-sm w-full rounded-xl border-slate-200"
                onChange={(e) => {
                    const [field, order] = e.target.value.split(":");
                    setSortConfig({ field, order: parseInt(order) });
                }}
            >
                <option value="order_date:-1">Newest First</option>
                <option value="order_date:1">Oldest First</option>
                <option value="total_cost:-1">Price: High to Low</option>
                <option value="total_cost:1">Price: Low to High</option>
            </select>
          </div>

          {/* Counter */}
          <div className="flex items-center justify-end px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {bookings.length} Results Found
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white border border-slate-100 rounded-xl shadow-sm">
        {loading ? (
            <div className="flex justify-center py-20"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
            <table className="table w-full">
                <thead className="bg-slate-50/80 text-slate-500">
                    <tr className="border-b border-slate-100">
                        <th className="py-4 font-bold text-[11px] uppercase tracking-wider">User & Service</th>
                        <th className="font-bold text-[11px] uppercase tracking-wider text-center">Location</th>
                        <th className="font-bold text-[11px] uppercase tracking-wider text-center">Status</th>
                        <th className="font-bold text-[11px] uppercase tracking-wider text-center">Payment</th>
                        <th className="font-bold text-[11px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {filtered.map((booking) => (
                    <tr key={booking._id} className="border-b last:border-none hover:bg-slate-50/30 transition-colors">
                        <td className="py-5">
                            <div className="font-bold text-slate-800">{booking.service_title}</div>
                            <div className="text-[10px] text-primary flex items-center gap-1 font-bold mt-1">
                                <FaUser /> {booking.user_email}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                <FaCalendarAlt /> {booking.startDate} • ৳{booking.total_cost}
                            </div>
                        </td>
                        <td className="text-center">
                            <div className="text-sm font-medium text-slate-700">{booking.division}</div>
                            <div className="text-xs text-slate-500">{booking.district}, {booking.area}</div>
                        </td>
                        <td className="text-center">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                booking.status === 'Assigned' ? 'bg-indigo-100 text-indigo-600' : 
                                booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                                {booking.status || 'Pending'}
                            </span>
                            {booking.assigned_professional_name && (
                              <div className="text-[10px] text-slate-500 mt-1">Assigned: {booking.assigned_professional_name}</div>
                            )}
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
                                {booking.assigned_professional || booking.assigned_professional_name ? (
                                  <button className="btn btn-sm btn-outline btn-success rounded-xl normal-case" disabled>
                                    Assigned{booking.assigned_professional_name ? `: ${booking.assigned_professional_name}` : ''}
                                  </button>
                                ) : booking.payment_status === 'Paid' ? (
                                    <button 
                                        className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-xl"
                                        onClick={() => handleAssignProfessional(booking)}
                                    >
                                        <FaUserMd /> Assign
                                    </button>
                                ) : null}
                                {!(userRole === 'admin' || userRole === 'superadmin') && (
                                  <button className="btn btn-sm btn-ghost text-red-400 hover:bg-red-50 rounded-xl">
                                      <FaTrashAlt />
                                  </button>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center items-center mt-8 gap-4 pb-10">
        <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="btn btn-sm btn-circle btn-ghost"
        >
            <FaChevronLeft />
        </button>
        <span className="text-sm font-bold text-slate-600 tracking-tight">
            Page <span className="text-primary">{page}</span> of {totalPages}
        </span>
        <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="btn btn-sm btn-circle btn-ghost"
        >
            <FaChevronRight />
        </button>
      </div>

      {/* Assign Professional Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Assign Professional</h3>
            <p className="mb-4">Select a nearby professional for this booking:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {professionals.length === 0 ? (
                <p className="text-center text-slate-500">No available professionals in this area.</p>
              ) : (
                professionals.map((prof) => (
                  <div key={prof._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{prof.name}</div>
                      <div className="text-sm text-slate-600">{prof.email} • {prof.contact}</div>
                      <div className="text-xs text-slate-500">Exp: {prof.experience} • Rating: {prof.rating}/5</div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssign(prof._id)}
                      disabled={assigning}
                    >
                      {assigning ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AllBookingsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-400">Loading Dashboard...</div>}>
      <AllBookingsContent />
    </Suspense>
  );
}