"use client";
import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaShieldAlt, FaHandHoldingHeart, FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const ServiceDetailsPage = ({ service }) => {
  const [bookingData, setBookingData] = useState({
    duration: 1,
    address: "",
    area: "",
    city: "",
  });


  const totalCost = service ? service.price_per_unit * bookingData.duration : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    const finalBooking = {
      ...bookingData,
      service_id: service.service_id,
      service_title: service.title,
      total_cost: totalCost,
      status: "Pending",
      user_email: "user@example.com", 
      created_at: new Date(),
    };

    
  };

  if (!service) return <div className="loading loading-spinner"></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-poppins">
      <div className="max-w-360 mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-black mb-6">{service.title}</h1>
            <div className="bg-white rounded-4xl p-10 shadow-sm border border-slate-100">
              <p className="whitespace-pre-line text-slate-600 font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">৳{service.price_per_unit}</span>
                <span className="text-slate-500 font-bold uppercase text-xs">/ {service.unit}</span>
              </div>

              {/* MODAL TRIGGER BUTTON */}
              <button
                onClick={() => document.getElementById("booking_modal").showModal()}
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
            {/* Step 1: Duration */}
            <div className="form-control">
              <label className="label font-bold text-slate-700">Select Duration ({service.unit}s)</label>
              <div className="flex items-center gap-4">
                 <input 
                  type="range" min="1" max="24" 
                  value={bookingData.duration} 
                  onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  className="range range-primary flex-1" 
                />
                <span className="badge badge-primary h-10 w-16 text-white font-bold">{bookingData.duration}</span>
              </div>
            </div>

            {/* Step 2: Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-sm font-semibold">City / District</label>
                <input required type="text" placeholder="e.g. Dhaka" className="input input-bordered rounded-xl" 
                  onChange={(e) => setBookingData({...bookingData, city: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label text-sm font-semibold">Area</label>
                <input required type="text" placeholder="e.g. Dhanmondi" className="input input-bordered rounded-xl" 
                  onChange={(e) => setBookingData({...bookingData, area: e.target.value})} />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-sm font-semibold">Full Address</label>
              <textarea required className="textarea textarea-bordered rounded-xl h-20" placeholder="House #, Road #"
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}></textarea>
            </div>

            {/* Step 3: Total Cost Show dynamically */}
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