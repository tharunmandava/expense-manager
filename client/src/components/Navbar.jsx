import { NavLink } from 'react-router-dom';
import {useState} from 'react';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#B065FF] bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-[#B065FF] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      return (
        <nav className="sticky top-0 left-0 w-full bg-black/60 backdrop-blur-lg z-50 border-b border-transparent">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left for the Logo */}
            <div className="flex items-center">
              <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                <span className="text-white text-lg sm:text-2xl font-bold">
                  <span className='text-primary-200'>えん</span> &nbsp;&nbsp; BillBuddy
                </span>
              </NavLink>
            </div>
            
            {/* Right for the Links */}
            <div className="hidden md:flex space-x-4">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/groups" className={linkClass}>
                Groups
              </NavLink>
              <NavLink to="/filler" className={linkClass}>
                Filler
              </NavLink>
            </div>
      
            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black/60 backdrop-blur-lg`}>
            <div className="flex flex-col space-y-4 px-4 py-2">
              <NavLink to="/" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/groups" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                Groups
              </NavLink>
              <NavLink to="/filler" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                Filler
              </NavLink>
            </div>
          </div>
        </nav>
      ); 
}

export default Navbar;
