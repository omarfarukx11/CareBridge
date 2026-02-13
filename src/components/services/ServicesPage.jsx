"use client";
import Link from 'next/link';
import { FaBaby, FaBlind, FaStethoscope, FaHeartbeat, FaHome, FaUserNurse } from 'react-icons/fa';

const ServicesPage = ({services}) => {

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-360 mx-auto">
        

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Care Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the right care for your family. All our caregivers are verified, 
            highly trained, and ready to support your needs.
          </p>
          <div className="divider w-24 mx-auto border-primary"></div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 group">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-base-200 rounded-2xl group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  {service.tag && (
                    <div className="badge badge-primary badge-outline font-semibold">{service.tag}</div>
                  )}
                </div>
                <h2 className="card-title text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h2>
                <p className="text-gray-500 mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="mb-6">
                  <span className="text-sm text-gray-400">Starting from</span>
                  <p className="text-2xl font-bold text-gray-800">৳ {service.price_per_unit} <span className="text-sm font-normal text-gray-500">/ session</span></p>
                </div>
                <div className="card-actions justify-end flex-nowrap gap-2">
                  <Link href={`/services/${service._id}`} className="btn btn-primary flex-1">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;