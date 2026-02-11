"use client";
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaHandHoldingHeart } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      <div className="container mx-auto px-4 py-10">
        <div className="footer grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <aside>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
              <FaHandHoldingHeart />
              <span>Care.Bridge</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              Making caregiving easy, secure, and accessible. Providing reliable services for your loved ones since 2024.
            </p>
            <div className="flex gap-4 mt-6">
              <a className="text-xl hover:text-primary transition-colors cursor-pointer"><FaFacebook /></a>
              <a className="text-xl hover:text-primary transition-colors cursor-pointer"><FaTwitter /></a>
              <a className="text-xl hover:text-primary transition-colors cursor-pointer"><FaInstagram /></a>
              <a className="text-xl hover:text-primary transition-colors cursor-pointer"><FaLinkedin /></a>
            </div>
          </aside>

          <nav>
            <header className="footer-title opacity-100 font-bold text-gray-700">Our Services</header>
            <Link href="/service/baby-care" className="link link-hover">Baby Sitting</Link>
            <Link href="/service/elderly-care" className="link link-hover">Elderly Care</Link>
            <Link href="/service/sick-care" className="link link-hover">Sick People Service</Link>
            <Link href="/services" className="link link-hover">Special Home Care</Link>
          </nav>

          <nav>
            <header className="footer-title opacity-100 font-bold text-gray-700">Company</header>
            <Link href="/about" className="link link-hover">About Us</Link>
            <Link href="/contact" className="link link-hover">Contact</Link>
            <Link href="/terms" className="link link-hover">Terms of Service</Link>
            <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
          </nav>

          <nav>
            <header className="footer-title opacity-100 font-bold text-gray-700">Contact Us</header>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary p-2 rounded-full text-white">
                <FaPhoneAlt size={12} />
              </div>
              <span>+880 1234 567 890</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-full text-white">
                <FaEnvelope size={12} />
              </div>
              <span>support@care.xyz</span>
            </div>
            <div className="mt-4">
               <span className="text-sm">Available 24/7 for emergency care.</span>
            </div>
          </nav>
        </div>

        <div className="border-t border-base-300 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
          <p>© {new Date().getFullYear()} Care.xyz - All rights reserved.</p>
          <div className="flex gap-4">
             <span>Security Verified</span>
             <span>Trusted Provider</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;