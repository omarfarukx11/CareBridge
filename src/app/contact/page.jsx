"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi"; 

const ContactSection = () => {
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fields = formRef.current.querySelectorAll(".form-field");
    gsap.fromTo(
      fields,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out",
        delay: 0.5 
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    

    setTimeout(() => {
      console.log("Submitting to MongoDB:", data);
      setIsSubmitting(false);
      setIsModalOpen(true); 
      e.target.reset();   
    }, 1500);
  };

  return (
    <section className="relative py-20 bg-white dark:bg-slate-900 overflow-hidden">

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-slate-700"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                <FiCheckCircle />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                Thank you for reaching out. Our team will contact you shortly.
              </p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
              Let’s Talk About <br />
              <span className="text-blue-600">Trusted Care</span>
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg mb-10 max-w-md">
              Have questions about child or elderly care? Our team is ready to assist you in making caregiving easy and secure.
            </p>

            <div className="space-y-8">
              <ContactInfo icon={<FiPhone />} title="Call Us" detail="+880 1234-567890" />
              <ContactInfo icon={<FiMail />} title="Email Support" detail="hello@care.xyz" />
              <ContactInfo icon={<FiMapPin />} title="Our Office" detail="Dhaka, Bangladesh" />
            </div>
          </motion.div>

          <div className="bg-gray-50 dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="form-field">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                <input 
                  name="fullname"
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Message</label>
                <textarea 
                  name="message"
                  rows="4"
                  placeholder="Tell us how we can help..."
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`form-field w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center space-x-3 transition-colors`}
              >
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                {!isSubmitting && <FiSend size={18} />}
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon, title, detail }) => (
  <div className="flex items-start space-x-5">
    <div className="bg-blue-600 dark:bg-blue-700 p-3 rounded-xl text-white shadow-md">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 dark:text-slate-100">{title}</h4>
      <p className="text-gray-600 dark:text-slate-400">{detail}</p>
    </div>
  </div>
);

export default ContactSection;