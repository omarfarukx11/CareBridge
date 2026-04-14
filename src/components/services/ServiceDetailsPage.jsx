"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaShieldAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaStar,
  FaUserMd,
} from "react-icons/fa";
import Swal from "sweetalert2";
import locationsData from "@/lib/area.json";
import { createBooking } from "@/action/server/bookings";
import Image from "next/image";
import NotFound from "@/app/not-found";

const ServiceDetailsPage = ({ service }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookingType, setBookingType] = useState("hour");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      duration: 1,
      startTime: "09:00",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      division: "",
      district: "",
      area: "",
      address: "",
    },
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const currentDuration = watch("duration");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Calculate days automatically if Daily Package is selected
  useEffect(() => {
    if (bookingType === "day" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setValue("duration", diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate, bookingType, setValue]);

  const divisions = useMemo(
    () =>
      locationsData ? [...new Set(locationsData.map((l) => l.region))] : [],
    [],
  );
  const filteredDistricts = useMemo(
    () => locationsData.filter((l) => l.region === selectedDivision),
    [selectedDivision],
  );
  const filteredAreas = useMemo(() => {
    const districtObj = filteredDistricts.find(
      (d) => d.district === selectedDistrict,
    );
    return districtObj ? districtObj.covered_area : [];
  }, [selectedDistrict, filteredDistricts]);

  const hRate = service?.hourly_rate || 0;
  const dRate = service?.daily_rate || 0;
  const totalCost =
    (bookingType === "hour" ? hRate : dRate) * (Number(currentDuration) || 0);

  const userRole = session?.user?.role || null;
  const isRestrictedRole = status === "authenticated" && ["admin", "professional", "superadmin"].includes(userRole);
  const canBookOnPage = status !== "loading" && !isRestrictedRole;

  const onSubmit = async (data) => {
    if (!session) return router.push("/login");
    if (isRestrictedRole) {
      return Swal.fire({
        icon: "warning",
        title: "Booking not allowed",
        text: "Admin, superadmin, and professional accounts cannot book services.",
      });
    }

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

  if (!service) return <NotFound />;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            fill
            src={service.image}
            className="object-cover"
            alt={service.title}
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-white via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="px-4 py-2 bg-primary text-white text-xs font-black rounded-lg uppercase tracking-widest shadow-xl">
                Premium {service.tag || "Healthcare"}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 md:text-white mt-6 leading-[0.9] tracking-tighter max-w-4xl">
                {service.title}
              </h1>
              <div className="flex items-center gap-6 mt-8 text-slate-700 md:text-slate-200">
                <div className="flex items-center gap-2">
                  <FaStar className="text-orange-400" />
                  <span className="font-bold">4.9 (1.2k Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-primary" />
                  <span className="font-bold">Fully Insured</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 space-y-12"
        >
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl">
                <FaInfoCircle />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                About this Service
              </h3>
            </div>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">
              {service.description}
            </p>
          </section>

          <section className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              Why Choose Our {service.title}?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { t: "Expert Staff", d: "Certified & Background Checked" },
                { t: "Transparent", d: "No hidden costs, hourly billing" },
                { t: "Flexible", d: "Reschedule anytime via dashboard" },
                { t: "Support", d: "24/7 dedicated medical board" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <FaCheckCircle className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-black text-slate-900">{item.t}</h4>
                    <p className="text-xs text-slate-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-28 group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative bg-[#0f172a] rounded-lg shadow-sm overflow-hidden border border-white/10">
              <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 border-b border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary font-black uppercase tracking-[3px] text-[10px] mb-2">
                      Standard Rate
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white italic">
                        ৳{service.hourly_rate}
                      </span>
                      <span className="text-slate-400 font-bold text-sm">
                        /hr
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/10">
                    <FaUserMd className="text-primary text-2xl" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      icon: <FaCheckCircle size={14} />,
                      text: "Verified Professional Care",
                      color: "text-green-500",
                      bg: "bg-green-500/10",
                    },
                    {
                      icon: <FaShieldAlt size={14} />,
                      text: "Liability Insurance Covered",
                      color: "text-blue-500",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: <FaClock size={14} />,
                      text: "Instant Scheduling",
                      color: "text-purple-500",
                      bg: "bg-purple-500/10",
                    },
                  ].map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-slate-300"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${feat.bg} flex items-center justify-center ${feat.color}`}
                      >
                        {feat.icon}
                      </div>
                      <span className="text-sm font-semibold">{feat.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 rounded-3xl p-5 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-sm">
                        Daily Package
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        Best for long-term care
                      </p>
                    </div>
                    <span className="text-xl font-black text-primary">
                      ৳{service.daily_rate}
                    </span>
                  </div>
                </div>

                {status === "loading" ? (
                  <div className="rounded-3xl p-8 bg-slate-900/80 border border-white/10">
                    <p className="text-white text-sm font-bold mb-3">Checking Access...</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Please wait while we validate your account before booking.
                    </p>
                  </div>
                ) : isRestrictedRole ? (
                  <div className="rounded-3xl p-8 bg-slate-900/80 border border-white/10">
                    <p className="text-white text-sm font-bold mb-3">Booking Disabled</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Admin and professional accounts are not allowed to book services.
                      Please use a regular user account to place a booking.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => document.getElementById("b_modal").showModal()}
                      className="primary-btn w-full"
                    >
                      Book Now <FaArrowRight />
                    </button>

                    <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Secure Process • No Payment Required Now
                    </p>
                  </>
                )}
              </div>

              {/* Trust Footer */}
              <div className="bg-slate-900/50 p-6 border-t border-white/5 flex items-center justify-center opacity-30 grayscale brightness-200">
                <span className="text-[10px] font-black tracking-widest text-white">
                  CARE.BRIDGE SECURE PROTOCOL
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {status !== "loading" && !isRestrictedRole && (
        <dialog
          id="b_modal"
          className="modal modal-bottom sm:modal-middle backdrop-blur-md overflow-y-auto"
        >
        <div className="modal-box max-w-4xl p-0 bg-white rounded-lg shadow-2xl border-none h-fit my-6 sm:my-12 mx-auto">
          <div className="bg-[#0f172a] p-8 md:p-10 text-white relative">
            <form method="dialog">
              <button className="absolute right-6 cursor-pointer top-6 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-sm outline-none">
                ✕
              </button>
            </form>
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                Confirm Booking
              </h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                {service?.title}
              </p>
            </div>

            <div className="mt-8 flex bg-white/5 p-1 rounded-lg w-fit border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setBookingType("hour");
                  setValue("duration", 1);
                }}
                className={`px-8 py-2.5 rounded-lg text-xs cursor-pointer font-black transition-all outline-none ${bookingType === "hour" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => setBookingType("day")}
                className={`px-8 py-2.5 rounded-lg text-xs cursor-pointer font-black transition-all outline-none ${bookingType === "day" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                Daily
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-10 space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[3px] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Schedule Details
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label-text text-[10px] font-bold text-slate-400 mb-2 ml-1">
                        START DATE
                      </label>
                      <input
                        type="date"
                        {...register("startDate", { required: true })}
                        className="w-full font-bold text-sm rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label-text text-[10px] font-bold text-slate-400 mb-2 ml-1">
                        {bookingType === "day" ? "END DATE" : "START TIME"}
                      </label>
                      {bookingType === "day" ? (
                        <input
                          type="date"
                          {...register("endDate", { required: true })}
                          className="w-full font-bold text-sm rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      ) : (
                        <input
                          type="time"
                          {...register("startTime", { required: true })}
                          className="w-full font-bold text-sm rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label-text text-[10px] font-bold text-slate-400 mb-2 ml-1 uppercase">
                      Total {bookingType === "hour" ? "Hours" : "Days"} Needed
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("duration", { required: true, min: 1 })}
                        className={`w-full font-black text-lg rounded-lg h-14 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${bookingType === "day" ? "bg-slate-100 cursor-not-allowed" : "bg-slate-50"}`}
                        readOnly={bookingType === "day"}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                        {bookingType === "hour" ? "Hrs" : "Days"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[3px] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Service Location
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      {...register("division", { required: true })}
                      className="w-full font-bold text-xs rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onChange={(e) => {
                        setValue("division", e.target.value);
                        setValue("district", "");
                        setValue("area", "");
                      }}
                    >
                      <option value="">Division</option>
                      {divisions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <select
                      {...register("district", { required: true })}
                      className="w-full font-bold text-xs rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={!selectedDivision}
                      onChange={(e) => {
                        setValue("district", e.target.value);
                        setValue("area", "");
                      }}
                    >
                      <option value="">District</option>
                      {filteredDistricts.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <select
                    {...register("area", { required: true })}
                    className="w-full font-bold text-xs rounded-lg h-14 bg-slate-50 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    disabled={!selectedDistrict}
                  >
                    <option value="">Select Covered Area</option>
                    {filteredAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <textarea
                    {...register("address", { required: true })}
                    className="w-full rounded-lg h-24 font-medium bg-slate-50 border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                    placeholder="House no, Road name, Apartment details..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total Amount Due
                </p>
                <div className="flex items-baseline gap-1 justify-center md:justify-start">
                  <span className="text-3xl font-black italic text-slate-900">
                    ৳{totalCost}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">
                    /total
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="primary-btn"
              >
                Confirm Booking <FaArrowRight className="text-sm" />
              </button>
            </div>
          </form>
        </div>
      </dialog>
      )}
    </div>
  );
};

export default ServiceDetailsPage;
