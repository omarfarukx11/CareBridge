"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaClock, FaMapMarkerAlt, FaArrowRight, FaShieldAlt, 
  FaInfoCircle, FaCheckCircle, FaCalendarAlt 
} from "react-icons/fa";
import Swal from "sweetalert2";
import locationsData from "@/lib/area.json";
import { createBooking } from "@/action/server/bookings";
import Image from "next/image";

const ServiceDetailsPage = ({ service }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookingType, setBookingType] = useState("hour");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      duration: 1,
      startTime: "09:00",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      division: "",
      district: "",
      area: "",
      address: ""
    }
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const currentDuration = watch("duration");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (bookingType === "day" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      setValue("duration", diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate, bookingType, setValue]);

  const divisions = useMemo(() => (locationsData ? [...new Set(locationsData.map(l => l.region))] : []), []);
  const filteredDistricts = useMemo(() => locationsData.filter(l => l.region === selectedDivision), [selectedDivision]);
  const filteredAreas = useMemo(() => {
    const districtObj = filteredDistricts.find(d => d.district === selectedDistrict);
    return districtObj ? districtObj.covered_area : [];
  }, [selectedDistrict, filteredDistricts]);

  const hRate = service?.hourly_rate || 0;
  const dRate = service?.daily_rate || 0;
  const totalCost = (bookingType === "hour" ? hRate : dRate) * (Number(currentDuration) || 0);

  const onSubmit = async (data) => {
    if (!session) return router.push("/login");
    Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });

    const result = await createBooking({
      ...data,
      booking_type: bookingType,
      service_id: service?._id,
      service_title: service?.title,
      user_email: session.user.email,
      total_cost: totalCost,
      status: "Pending",
      order_date: new Date().toISOString(),
    });

    if (result?.success) {
      document.getElementById("b_modal").close();
      Swal.fire("Success", "Booking Saved!", "success");
      router.push("/dashboard/myBooking");
    } else {
      Swal.fire("Error", result?.error || "Failed", "error");
    }
  };

  if (!service) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-10 md:pb-20 font-poppins">
      {/* HERO SECTION */}
      <div className="w-full h-75 md:h-112.5 relative overflow-hidden">
        <Image height={10} width={10} src={service.image} className="w-full h-full object-cover" alt={service.title} />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-6 md:bottom-12 left-0 w-full px-4 md:px-6">
           <div className="max-w-7xl mx-auto">
              <span className="px-3 py-1 md:px-5 md:py-2 bg-primary text-white text-[10px] md:text-xs font-black rounded-full uppercase tracking-[2px]">Verified Service</span>
              <h1 className="text-2xl md:text-6xl font-black text-white mt-3 md:mt-6 drop-shadow-lg max-w-4xl leading-tight">
                {service.title}
              </h1>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-8 md:mt-16">
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="bg-white rounded-[25px] md:rounded-[40px] p-6 md:p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-3 text-slate-800">
              <FaInfoCircle className="text-primary"/> Service Description
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-lg font-light whitespace-pre-line">
              {service.description}
            </p>
          </div>
          
          <div className="bg-white rounded-[25px] md:rounded-[40px] p-6 md:p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl md:text-2xl font-black mb-6 text-slate-800">Service Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Professional Staff", "Affordable Pricing", "Quality Guaranteed", "24/7 Support"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaCheckCircle className="text-primary" />
                  <span className="font-bold text-slate-700 text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-2xl border border-slate-50">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-400 text-[10px] md:text-xs uppercase">Hourly Rate</span>
                <span className="text-xl md:text-2xl font-black text-slate-900">৳{service.hourly_rate}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-400 text-[10px] md:text-xs uppercase">Daily Rate</span>
                <span className="text-xl md:text-2xl font-black text-slate-900">৳{service.daily_rate}</span>
              </div>
            </div>
            <button 
              onClick={() => document.getElementById("b_modal").showModal()} 
              className="btn btn-primary w-full rounded-[20px] md:rounded-[25px] h-16 md:h-20 text-lg md:text-xl text-white font-black shadow-lg"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      <dialog id="b_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl rounded-t-[30px] sm:rounded-[40px] p-0 bg-white overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-6 md:p-10 text-white relative text-center">
            <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button></form>
            <h3 className="text-xl md:text-3xl font-black uppercase mb-4 md:mb-6">Configure Booking</h3>
            
            <div className="bg-white/5 p-1 rounded-2xl md:rounded-3xl inline-flex border border-white/10">
              <button type="button" onClick={() => { setBookingType("hour"); setValue("duration", 1); }} className={`px-6 md:px-10 py-2 md:py-3 rounded-xl md:rounded-[20px] text-xs md:text-sm font-black transition-all ${bookingType === 'hour' ? 'bg-primary text-white' : 'text-slate-400'}`}>Hourly</button>
              <button type="button" onClick={() => { setBookingType("day"); }} className={`px-6 md:px-10 py-2 md:py-3 rounded-xl md:rounded-[20px] text-xs md:text-sm font-black transition-all ${bookingType === 'day' ? 'bg-primary text-white' : 'text-slate-400'}`}>Daily</button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* SCHEDULE SECTION */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-black flex items-center gap-2 text-slate-800 text-lg md:text-xl"><FaClock className="text-primary"/> 1. Schedule</h3>
                <div className="bg-slate-50 p-5 md:p-6 rounded-[25px] md:rounded-[32px] space-y-4 border border-slate-100">
                  <div className={`grid ${bookingType === 'day' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <div className="form-control">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{bookingType === 'hour' ? 'Service Date' : 'Start Date'}</label>
                      <input type="date" {...register("startDate", { required: true })} className="input bg-transparent border-none text-base md:text-lg font-black p-0 h-auto focus:outline-none" />
                    </div>
                    {bookingType === 'day' && (
                      <div className="form-control">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">End Date</label>
                        <input type="date" {...register("endDate", { required: true })} className="input bg-transparent border-none text-base md:text-lg font-black p-0 h-auto focus:outline-none" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 md:gap-6 border-t pt-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Start Time</label>
                      <input type="time" {...register("startTime", { required: true })} className="input bg-transparent border-none text-base md:text-lg font-black p-0 h-auto focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{bookingType === 'hour' ? 'Hours' : 'Days'}</label>
                      <input type="number" {...register("duration", { required: true, min: 1 })} className="input bg-transparent border-none text-base md:text-lg font-black p-0 h-auto focus:outline-none" readOnly={bookingType === 'day'} />
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION SECTION */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-black flex items-center gap-2 text-slate-800 text-lg md:text-xl"><FaMapMarkerAlt className="text-primary"/> 2. Location</h3>
                <div className="space-y-3 md:space-y-4">
                  <select {...register("division", { required: true })} className="select select-bordered select-sm md:select-md w-full rounded-xl md:rounded-2xl" onChange={(e) => { setValue("division", e.target.value); setValue("district", ""); setValue("area", ""); }}>
                    <option value="">Select Division</option>
                    {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="flex gap-2 md:gap-4">
                    <select {...register("district", { required: true })} className="select select-bordered select-sm md:select-md flex-1 rounded-xl md:rounded-2xl" disabled={!selectedDivision} onChange={(e) => { setValue("district", e.target.value); setValue("area", ""); }}>
                      <option value="">District</option>
                      {filteredDistricts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
                    </select>
                    <select {...register("area", { required: true })} className="select select-bordered select-sm md:select-md flex-1 rounded-xl md:rounded-2xl" disabled={!selectedDistrict}>
                      <option value="">Area</option>
                      {filteredAreas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <textarea {...register("address", { required: true })} className="textarea textarea-bordered w-full rounded-xl md:rounded-2xl h-20 md:h-24 text-sm" placeholder="Full Address Details"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[30px] md:rounded-[40px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center text-white gap-6">
              <div className="text-center md:text-left">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] md:tracking-[4px] mb-1">Total Payable</p>
                <h4 className="text-4xl md:text-6xl font-black">৳{totalCost}</h4>
              </div>
              <button type="submit" className="btn btn-primary w-full md:w-auto px-10 md:px-16 h-14 md:h-20 rounded-2xl md:rounded-[25px] text-white font-black text-lg md:text-xl border-none shadow-2xl">
                Confirm Booking <FaArrowRight className="ml-3 hidden md:inline"/>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceDetailsPage;