import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#B065FF] bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-[#B065FF] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="sticky top-0 left-0 w-full bg-black/60 backdrop-blur-lg z-50 border-b border-transparent">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              {/* <img
                className="h-10 w-auto"
                src={logo}
                alt="React Jobs"
              /> */}
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                <span className='text-[#B065FF]'>えん</span> &nbsp;&nbsp; Okane
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink
                  to="/"
                  className={linkClass}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/groups"
                  className={linkClass}
                >
                  Groups
                </NavLink>
                <NavLink
                  to="/filler"
                  className={linkClass}
                >
                  Filler
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
