"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { IoLogOutOutline, IoPersonOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isHomePage = pathname === "/";


  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        setIsScrolled(window.scrollY > 100);
      } else {
        setIsScrolled(true); 
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/register") || pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return null;

  const isActive = (path) => pathname === path;

  const isTransparent = isHomePage && !isScrolled;

  const navStyles = isTransparent
    ? "bg-transparent py-4 border-transparent"
    : "bg-white shadow-md border-b border-gray-100 py-2";

  const textColor = isTransparent ? "text-white" : "text-gray-800";

  const navLinks = (
    <>
      <li><Link href="/" className={isActive('/') ? 'active-link' : ''}>Home</Link></li>
      <li><Link href="/services" className={isActive('/services') ? 'active-link' : ''}>Services</Link></li>
      <li><Link href="/about" className={isActive('/about') ? 'active-link' : ''}>About Us</Link></li>
      <li><Link href="/contact" className={isActive('/contact') ? 'active-link' : ''}>Contact</Link></li>
    </>
  );

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navStyles}`}>
        <div className="navbar max-w-7xl mx-auto px-4">
          
          <div className="navbar-start">
            <button onClick={() => setIsOpen(true)} className={`btn btn-ghost lg:hidden p-2 ${textColor}`}>
              <HiOutlineMenuAlt3 className="text-2xl" />
            </button>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-primary">Care.</span>
              <span className={textColor}>Bridge</span>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className={`menu menu-horizontal px-1 font-medium gap-2 ${textColor}`}>
              {navLinks}
            </ul>
          </div>

          <div className="navbar-end gap-3">
            {status === "authenticated" ? (
              <>
                <Link href={'/dashboard/myBooking'} className='primary-btn text-[10px] md:text-sm'>
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="hidden lg:flex btn bg-red-600 hover:bg-red-700 border-none text-white btn-sm md:btn-md"
                >
                  <IoLogOutOutline className='text-xl' />
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm md:btn-md text-white px-6">Login</Link>
            )}
          </div>
        </div>

        {/* --- MOBILE SIDEBAR --- */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 lg:hidden"
              />
              <motion.aside 
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[75%] bg-white z-70 shadow-2xl p-6 lg:hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold text-primary">Care.Bridge</span>
                    <button onClick={() => setIsOpen(false)} className="btn btn-circle btn-ghost btn-sm">
                      <HiX className="text-2xl" />
                    </button>
                  </div>
                  <ul className="menu menu-vertical p-0 gap-3 text-lg font-medium text-gray-800">
                    {navLinks}
                  </ul>
                </div>
                {status === "authenticated" && (
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                          <IoPersonOutline className="text-xl" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 truncate">{session?.user?.name || "User"}</p>
                    </div>
                    <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-2xl">
                      <IoLogOutOutline className='text-2xl' />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {!isTransparent && <div className="h-20 w-full"></div>}
    </>
  );
};

export default Header;