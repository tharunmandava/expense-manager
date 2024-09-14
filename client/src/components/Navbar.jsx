import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#B065FF] bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-[#B065FF] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

      return (
        <nav className="sticky top-0 left-0 w-full bg-black/60 backdrop-blur-lg z-50 border-b border-transparent">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Further Left for the Logo */}
            <div className="flex items-center">
              <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                <span className="text-white text-2xl font-bold">
                  <span className='text-[#B065FF]'>えん</span> &nbsp;&nbsp; Billbuddy
                </span>
              </NavLink>
            </div>
            
            {/* Further Right for the Links */}
            <div className="ml-auto">
              <div className="flex space-x-4">
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
            </div>
          </div>
        </nav>
      ); 
}

export default Navbar;
