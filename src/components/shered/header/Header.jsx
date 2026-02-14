"use client";
import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { IoLogOutOutline } from "react-icons/io5";
const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  if (pathname.startsWith("/register") || pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return null;

  const navLinks = (
    <>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/services">Services</Link></li>
      <li><Link href="/about">About Us</Link></li>
    </>
  );

  return (
    <div className='bg-base-100 py-2 sticky top-0 z-50'>
      <div className="navbar max-w-360 mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <HiOutlineMenuAlt3 className="text-2xl" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 font-medium">
              {navLinks}
            </ul>
          </div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold ">
            <span className="hidden sm:inline">Care.Bridge</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium gap-2">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {status === "authenticated" ? (
            <div className="flex items-center justify-center gap-5">
            <Link href={'/dashboard/myBooking'} className='btn btn-primary'>Dashboard</Link>
            <button onClick={() => signOut()} className="btn bg-red-600 rounded-lg text-white"><IoLogOutOutline className='text-xl' /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-primary btn-sm md:btn-md text-white">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;