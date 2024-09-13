import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#B065FF] bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-[#B065FF] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";


//-----------------------------------------------------------------------------------------------

return (
  <nav className="sticky top-0 left-0 w-full bg-black/60 backdrop-blur-lg z-50 border-b border-transparent">
    <div className="max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="flex items-center h-16">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <NavLink className="flex items-center" to="/">
            <span className="text-white text-2xl font-bold">
              <span className='text-[#B065FF]'>えん</span> &nbsp;&nbsp; Okane
            </span>
          </NavLink>
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-4 items-end ml-auto">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/groups" className={linkClass}>Groups</NavLink>
          <NavLink to="/filler" className={linkClass}>Filler</NavLink>
        </div>
      </div>
    </div>
  </nav>
);
}

export default Navbar;
