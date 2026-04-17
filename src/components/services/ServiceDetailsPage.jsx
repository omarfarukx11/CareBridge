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
              <span className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                Premium Healthcare
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 md:text-white mt-6 leading-[0.9] tracking-tighter max-w-4xl">
                {service.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 mt-8 text-slate-700 md:text-slate-200">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold">4.9 (1.2k Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-purple-400" />
                  <span className="font-bold">Fully Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-400" />
                  <span className="font-bold">24/7 Available</span>
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
              <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center text-purple-600 text-xl shadow-lg">
                <FaInfoCircle />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                About this Service
              </h3>
            </div>
            <div className="bg-linear-to-br from-slate-50 to-purple-50/30 rounded-3xl p-8 border border-purple-100/50">
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                {service.description}
              </p>
            </div>
          </section>

          <section className="bg-linear-to-br from-white to-purple-50/20 rounded-3xl p-10 border border-purple-100/30 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center text-emerald-600 text-xl shadow-lg">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-0">
                Why Choose Our {service.title}?
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { t: "Expert Healthcare Staff", d: "Certified & Background Verified Professionals", icon: FaUserMd, color: "from-emerald-500 to-green-600" },
                { t: "Transparent Pricing", d: "No hidden costs, clear hourly billing", icon: FaCheckCircle, color: "from-blue-500 to-indigo-600" },
                { t: "Flexible Scheduling", d: "Reschedule anytime via dashboard", icon: FaCalendarAlt, color: "from-purple-500 to-pink-600" },
                { t: "24/7 Support", d: "Dedicated medical coordination team", icon: FaShieldAlt, color: "from-orange-500 to-red-600" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 hover:border-purple-200 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <item.icon />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">{item.t}</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.d}</p>
                  </div>
                </motion.div>
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
            <div className="absolute -inset-1 bg-slate-200 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-50 p-8 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 font-bold uppercase tracking-wider text-xs mb-2">
                      Standard Rate
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">
                        ৳{service.hourly_rate}
                      </span>
                      <span className="text-slate-500 font-semibold text-sm">
                        /hr
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                    <FaUserMd className="text-slate-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      icon: <FaCheckCircle size={14} />,
                      text: "Certified Healthcare Professionals",
                      color: "text-green-600",
                      bg: "bg-green-50",
                      border: "border-green-200",
                    },
                    {
                      icon: <FaShieldAlt size={14} />,
                      text: "Full Insurance Coverage",
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                    },
                    {
                      icon: <FaClock size={14} />,
                      text: "Flexible Scheduling",
                      color: "text-slate-600",
                      bg: "bg-slate-50",
                      border: "border-slate-200",
                    },
                  ].map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-slate-700 group/item"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center ${feat.color} group-hover/item:scale-105 transition-transform duration-300`}
                      >
                        {feat.icon}
                      </div>
                      <span className="text-sm font-medium group-hover/item:text-slate-900 transition-colors">{feat.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-900 font-semibold text-sm">
                        Daily Package
                      </p>
                      <p className="text-slate-500 text-xs">
                        Perfect for extended care
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900">
                        ৳{service.daily_rate}
                      </span>
                      <p className="text-slate-500 text-xs">per day</p>
                    </div>
                  </div>
                </div>

                {status === "loading" ? (
                  <div className="rounded-2xl p-8 bg-slate-50 border border-slate-200">
                    <p className="text-slate-900 text-sm font-semibold mb-3">Verifying Access...</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Please wait while we validate your account for booking.
                    </p>
                  </div>
                ) : isRestrictedRole ? (
                  <div className="rounded-2xl p-8 bg-slate-50 border border-slate-200">
                    <p className="text-slate-900 text-sm font-semibold mb-3">Booking Restricted</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Administrative and professional accounts cannot book services.
                      Please use a standard user account.
                    </p>
                  </div>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => document.getElementById("b_modal").showModal()}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Book Now <FaArrowRight className="text-sm" />
                    </motion.button>

                    <p className="text-center text-slate-500 text-xs font-medium uppercase tracking-wider">
                      Secure • No Payment Required • Instant Confirmation
                    </p>
                  </>
                )}
              </div>

              {/* Trust Footer */}
              <div className="bg-slate-100 p-6 border-t border-slate-200 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-slate-600 text-sm" />
                  <span className="text-xs font-bold tracking-wider text-slate-700">
                    CARE.BRIDGE SECURE PROTOCOL
                  </span>
                </div>
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
        <div className="modal-box max-w-5xl p-0 bg-white rounded-3xl shadow-2xl border border-slate-200 h-fit my-6 sm:my-12 mx-auto overflow-hidden">
          <div className="bg-slate-900 p-8 md:p-10 text-white relative">
            <form method="dialog">
              <button className="absolute right-6 cursor-pointer top-6 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-lg outline-none border border-white/20">
                ✕
              </button>
            </form>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                Confirm Your Booking
              </h3>
              <p className="text-slate-300 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                <FaUserMd className="text-slate-400" />
                {service?.title}
              </p>
            </div>

            <div className="mt-8 flex bg-white/10 p-1.5 rounded-2xl w-fit border border-white/20">
              <button
                type="button"
                onClick={() => {
                  setBookingType("hour");
                  setValue("duration", 1);
                }}
                className={`px-8 py-3 rounded-xl text-sm cursor-pointer font-semibold transition-all outline-none ${
                  bookingType === "hour"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Hourly Service
              </button>
              <button
                type="button"
                onClick={() => setBookingType("day")}
                className={`px-8 py-3 rounded-xl text-sm cursor-pointer font-semibold transition-all outline-none ${
                  bookingType === "day"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Daily Package
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-600 font-bold text-sm">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Schedule Details</h4>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Start Date
                      </label>
                      <input
                        type="date"
                        {...register("startDate", { required: true })}
                        className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {bookingType === "day" ? "End Date" : "Start Time"}
                      </label>
                      {bookingType === "day" ? (
                        <input
                          type="date"
                          {...register("endDate", { required: true })}
                          className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
                        />
                      ) : (
                        <input
                          type="time"
                          {...register("startTime", { required: true })}
                          className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Duration ({bookingType === "hour" ? "Hours" : "Days"})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("duration", { required: true, min: 1 })}
                        className={`w-full font-medium text-lg rounded-2xl h-14 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300 ${
                          bookingType === "day" ? "bg-slate-100 cursor-not-allowed" : "bg-slate-50"
                        }`}
                        readOnly={bookingType === "day"}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                        {bookingType === "hour" ? "Hrs" : "Days"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-600 font-bold text-sm">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Service Location</h4>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Division
                      </label>
                      <select
                        {...register("division", { required: true })}
                        className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300"
                        onChange={(e) => {
                          setValue("division", e.target.value);
                          setValue("district", "");
                          setValue("area", "");
                        }}
                      >
                        <option value="">Select Division</option>
                        {divisions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        District
                      </label>
                      <select
                        {...register("district", { required: true })}
                        className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300 disabled:bg-slate-100"
                        disabled={!selectedDivision}
                        onChange={(e) => {
                          setValue("district", e.target.value);
                          setValue("area", "");
                        }}
                      >
                        <option value="">Select District</option>
                        {filteredDistricts.map((d) => (
                          <option key={d.district} value={d.district}>
                            {d.district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Service Area
                    </label>
                    <select
                      {...register("area", { required: true })}
                      className="w-full font-medium text-sm rounded-2xl h-14 bg-slate-50 border-2 border-slate-200 px-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300 disabled:bg-slate-100"
                      disabled={!selectedDistrict}
                    >
                      <option value="">Select Covered Area</option>
                      {filteredAreas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Detailed Address
                    </label>
                    <textarea
                      {...register("address", { required: true })}
                      className="w-full rounded-2xl h-24 font-medium bg-slate-50 border-2 border-slate-200 p-4 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all hover:border-slate-300 text-sm resize-none"
                      placeholder="House no, Road name, Apartment details..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-8 bg-slate-50/50 -mx-8 md:-mx-12 px-8 md:px-12 py-8 rounded-b-3xl">
              <div className="text-center lg:text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Total Amount Due
                </p>
                <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                  <span className="text-4xl font-black italic text-slate-900">
                    ৳{totalCost}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">
                    /total
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">Payment due after service completion</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-slate-500/25 transition-all duration-300 flex items-center gap-2"
              >
                Confirm Booking <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          </form>
        </div>
      </dialog>
      )}
    </div>
  );
};

export default ServiceDetailsPage;
