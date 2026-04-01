"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaChevronLeft, FaArrowRight } from "react-icons/fa6";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);

  const displayData = [
    {
      _id: "1",
      title: "Expert Elderly Care Services",
      image: "https://res.cloudinary.com/doofrrhwj/image/upload/v1774245411/cld-sample-5.jpg",
      tagline: "Reliable Support for Seniors"
    },
    {
      _id: "2",
      title: "Compassionate Child Nursing",
      image: "https://res.cloudinary.com/doofrrhwj/image/upload/v1774245411/cld-sample-4.jpg",
      tagline: "Trusted Care for Little Ones"
    },
    {
      _id: "3",
      title: "Professional Patient Support",
      image: "https://res.cloudinary.com/doofrrhwj/image/upload/v1774245411/cld-sample-3.jpg",
      tagline: "Medical Assistance at Home"
    },
    {
      _id: "4",
      title: "Specialized Disability Care",
      image: "https://res.cloudinary.com/doofrrhwj/image/upload/v1774245411/cld-sample-2.jpg",
      tagline: "Empowering Lives Daily"
    },
    {
      _id: "5",
      title: "Family First Caregiving",
      image: "https://res.cloudinary.com/doofrrhwj/image/upload/v1774245395/sample.jpg",
      tagline: "Because Family Deserves the Best"
    }
  ];

  const paginate = useCallback((newDirection) => {
    if (isAnimatingRef.current) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + displayData.length) % displayData.length);
  }, [displayData.length]);

  // Set to 5000ms (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && !isAnimatingRef.current) {
        paginate(1);
      }
    }, 5000); 
    return () => clearInterval(timer);
  }, [paginate]);

  const imageVariants = {
    enter: (direction) => ({
      clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      scale: 1.15,
      filter: "blur(10px)",
    }),
    center: {
      clipPath: "inset(0 0 0 0%)",
      scale: 1,
      filter: "blur(0px)",
      transition: {
        clipPath: { duration: 1.2, ease: [0.77, 0, 0.175, 1] },
        scale: { duration: 1.8, ease: "easeOut" },
      },
    },
    exit: (direction) => ({
      clipPath: direction < 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      filter: "blur(10px)",
      transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  const titleVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 h-[70vh] lg:h-screen">
      <AnimatePresence 
        initial={false} 
        custom={direction} 
        onExitComplete={() => {
            setIsAnimating(false);
            isAnimatingRef.current = false;
        }}
      >
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationStart={() => {
            setIsAnimating(true);
            isAnimatingRef.current = true;
          }}
          className="absolute inset-0 w-full h-full lg:w-screen lg:h-screen"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-black/40 to-black/10" />
          <Image
            fill
            src={displayData[currentIndex].image}
            alt="Banner Image"
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-30 h-full w-full">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl"
            >
              <motion.div variants={contentVariants} className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-white/60" />
                <span className="text-white/80 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                  {displayData[currentIndex].tagline}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-10">
                <motion.h1 
                  variants={titleVariants}
                  className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
                >
                   {displayData[currentIndex].title}
                </motion.h1>
              </div>

              <motion.div variants={contentVariants}>
                <Link href="/services">
                  <button className="flex items-center gap-4 bg-white text-neutral-950 group border-none py-3 rounded-full px-10 text-lg font-bold hover:bg-neutral-100 transition-all">
                    Explore Services
                    <span className="bg-neutral-950/10 p-2 rounded-full group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <FaArrowRight size={18} />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-12 z-40 flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-black text-white/90 bg-black/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10">
            <span className="text-3xl md:text-4xl text-white font-mono">
                {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm opacity-40 uppercase tracking-widest font-sans">
                / {String(displayData.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-neutral-900 transition-all group"
            >
              <FaChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="w-14 h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-100 transition-all shadow-lg group"
            >
              <FaChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4">
          {displayData.map((_, i) => (
              <button
                key={i}
                onClick={() => i !== currentIndex && paginate(i > currentIndex ? 1 : -1)}
                className={`w-1 transition-all duration-700 rounded-full ${currentIndex === i ? 'h-12 bg-white' : 'h-6 bg-white/20 hover:bg-white/50'}`}
              />
          ))}
      </div>
    </section>
  );
};

export default Banner;