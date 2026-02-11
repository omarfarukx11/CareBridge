"use client";
import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { FaUserCircle, FaHandHoldingHeart } from 'react-icons/fa';

const Header = () => {
  const user = null; 

  const navLinks = (
    <>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/services">Services</Link></li>
      {user && (
        <li><Link href="/my-bookings">My Bookings</Link></li>
      )}
      <li><Link href="/about">About Us</Link></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <HiOutlineMenuAlt3 className="text-2xl" />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 font-medium">
            {navLinks}
          </ul>
        </div>
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <FaHandHoldingHeart className="text-2xl" />
          <span className="hidden sm:inline">Care.Bridge</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium gap-2">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FaUserCircle className="text-2xl text-primary" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
              <li className="px-4 py-2 font-semibold text-gray-500">{user.email}</li>
              <hr />
              <li><Link href="/my-bookings">Dashboard</Link></li>
              <li><button className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm md:btn-md">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm md:btn-md text-white">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;