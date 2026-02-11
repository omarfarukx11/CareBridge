"use client";
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="hero min-h-[70vh] bg-base-200" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1581578731522-7b63494865e7?auto=format&fit=crop&q=80&w=2070)'}}>
      <div className="hero-overlay bg-opacity-60 bg-black"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Expert Care for Your Loved Ones</h1>
          <p className="mb-5 text-lg">
            Reliable, trusted, and professional caregiving services for children, elderly, and patients. Because family deserves the best.
          </p>
          <Link href="/services" className="btn btn-primary text-white">Explore Services</Link>
        </div>
      </div>
    </div>
  );
};
export default Banner;