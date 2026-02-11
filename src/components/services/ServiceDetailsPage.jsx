"use client";
import React from "react";
import Link from "next/link";
import { FaCalendarCheck, FaShieldAlt, FaHandHoldingHeart, FaArrowLeft } from "react-icons/fa";

const ServiceDetailsPage = ({ service }) => {
  if (!service) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

return (
  <div className="min-h-screen bg-slate-900 py-10 px-40">
    
    <div className="max-w-300 w-full mx-auto bg-white border border-blue-200 rounded-3xl p-10 shadow-sm">
      <h1 className="text-3xl font-bold">This is now centered and limited in width</h1>
      <p className="mt-4 text-gray-500">Service: {service.title}</p>
    </div>

  </div>
);
};

export default ServiceDetailsPage;