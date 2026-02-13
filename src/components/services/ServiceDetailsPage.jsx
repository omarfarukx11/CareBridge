"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Added
import { useRouter, usePathname } from "next/navigation"; // Added
import { FaCalendarCheck } from "react-icons/fa";

const ServiceDetailsPage = ({ service }) => {
  const { data: session } = useSession(); // Get user session
  const router = useRouter();
  const pathname = usePathname(); // Get current page URL

  const [bookingData, setBookingData] = useState({
    duration: 1,
    address: "",
    area: "",
    city: "",
  });

  const totalCost = service ? service.price_per_unit * bookingData.duration : 0;

  // Function to handle the "Book Appointment" button click
  const handleOpenModal = () => {
    if (!session) {
      // If no user, redirect to login with this page as the return destination
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      // If user exists, open the modal
      document.getElementById("booking_modal").showModal();
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    const finalBooking = {
      ...bookingData,
      service_id: service.service_id,
      service_title: service.title,
      total_cost: totalCost,
      status: "Pending",
      user_email: session?.user?.email, // Now using the real logged-in email
      created_at: new Date(),
    };

    console.log("Final Booking Object:", finalBooking);
    // Add your API call/Server Action here
  };

  if (!service) return <div className="loading loading-spinner"></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-poppins">
      <div className="max-w-360 mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-black mb-6">{service.title}</h1>
            <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
              <p className="whitespace-pre-line text-slate-600 font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">৳{service.price_per_unit}</span>
                <span className="text-slate-500 font-bold uppercase text-xs">/ {service.unit}</span>
              </div>

              {/* UPDATED TRIGGER */}
              <button
                onClick={handleOpenModal}
                className="btn btn-primary w-full rounded-2xl h-16 text-lg text-white"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- DAISYUI MODAL --- */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl rounded-3xl p-8">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <FaCalendarCheck className="text-primary" /> Confirm Your Booking
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-6">
             {/* ... Form inputs (Duration, City, Area, Address) remain the same ... */}
             <div className="form-control">
               <label className="label font-bold">Select Duration ({service.unit}s)</label>
               <input type="range" min="1" max="24" value={bookingData.duration} 
                 onChange={(e) => setBookingData({...bookingData, duration: e.target.value})} className="range range-primary" />
             </div>
             
             {/* (Rest of your form inputs here...) */}

             <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-dashed border-slate-300">
               <div>
                 <p className="text-xs uppercase text-slate-500 font-bold">Total Bill</p>
                 <p className="text-3xl font-black text-slate-800">৳{totalCost}</p>
               </div>
               <button type="submit" className="btn btn-primary px-10 rounded-xl text-white">Confirm & Book</button>
             </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceDetailsPage;