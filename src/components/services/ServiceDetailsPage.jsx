"use client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaClock, FaMapMarkerAlt, FaArrowRight, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import locationsData from "@/lib/area.json";
import { createBooking } from "@/action/server/bookings";


const ServiceDetailsPage = ({ service }) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      duration: 1,
      startTime: "09:00",
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");

  const divisions = useMemo(() => [...new Set(locationsData.map(l => l.region))], []);
  const filteredDistricts = useMemo(() => 
    locationsData.filter(l => l.region === selectedDivision), [selectedDivision]);
  const filteredAreas = useMemo(() => 
    filteredDistricts.find(d => d.district === selectedDistrict)?.covered_area || [], [selectedDistrict, filteredDistricts]);

  const onSubmit = async (data) => {
    if (!session) return router.push("/login");

    Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });

    const totalCost = (service?.hourly_rate || 0) * data.duration;
    
    const result = await createBooking({
      ...data,
      service_id: service?._id,
      service_title: service?.title,
      user_email: session.user.email,
      total_cost: totalCost,
    });

    if (result.success) {
      Swal.fire("Success", "Booking Saved!", "success");
      router.push("/dashboard/my-bookings");
    } else {
      Swal.fire("Error", "Failed to save booking", "error");
    }
  };

  if (!service) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-poppins">
      <div className="w-full h-[400px] relative">
        <img src={service.image} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/50 flex items-end p-10">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-5xl font-black text-white">{service.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-slate-600">{service.description}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl h-fit sticky top-20">
          <div className="text-3xl font-black mb-6">৳{service.hourly_rate}<span className="text-sm text-slate-400">/hr</span></div>
          <button onClick={() => document.getElementById("b_modal").showModal()} className="btn btn-primary w-full text-white">Book Now</button>
        </div>
      </div>

      <dialog id="b_modal" className="modal">
        <div className="modal-box max-w-3xl rounded-3xl p-0">
          <div className="bg-slate-900 p-6 text-white flex justify-between">
            <h3 className="text-xl font-bold">Confirm Booking</h3>
            <form method="dialog"><button className="btn btn-sm btn-circle">✕</button></form>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label font-bold">Service Date</label>
                <input type="date" {...register("startDate", { required: true })} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label font-bold">Duration (Hours)</label>
                <input type="number" {...register("duration", { required: true, min: 1 })} className="input input-bordered" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select {...register("division", { required: true })} className="select select-bordered" onChange={(e) => { register("division").onChange(e); setValue("district", ""); setValue("area", ""); }}>
                <option value="">Division</option>
                {divisions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select {...register("district", { required: true })} className="select select-bordered" disabled={!selectedDivision} onChange={(e) => { register("district").onChange(e); setValue("area", ""); }}>
                <option value="">District</option>
                {filteredDistricts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
              </select>

              <select {...register("area", { required: true })} className="select select-bordered" disabled={!selectedDistrict}>
                <option value="">Area</option>
                {filteredAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <textarea {...register("address", { required: true })} className="textarea textarea-bordered w-full h-24" placeholder="Full Street Address"></textarea>

            <button type="submit" className="btn btn-primary w-full text-white text-lg">Confirm & Pay</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceDetailsPage;