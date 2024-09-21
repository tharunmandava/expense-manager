import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side content */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} What a wow! All rights reserved.</p>
          </div>

          {/* Center content (Links) */}
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>

          {/* Right side content (Social media icons) */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Twitter Icon */}
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.732a4.804 4.804 0 0 0 2.106-2.656 9.6 9.6 0 0 1-3.04 1.165 4.792 4.792 0 0 0-8.168 4.37 13.611 13.611 0 0 1-9.876-5.008 4.791 4.791 0 0 0 1.483 6.388 4.766 4.766 0 0 1-2.172-.599v.06a4.793 4.793 0 0 0 3.847 4.697 4.8 4.8 0 0 1-2.166.084 4.796 4.796 0 0 0 4.478 3.326A9.622 9.622 0 0 1 1.14 19.745a13.587 13.587 0 0 0 7.355 2.156c8.827 0 13.658-7.315 13.658-13.656 0-.208-.005-.415-.014-.622A9.741 9.741 0 0 0 24 4.548a9.557 9.557 0 0 1-2.357.645z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Facebook Icon */}
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.402.597 24 1.326 24H12.82v-9.294H9.692v-3.623h3.129V8.41c0-3.1 1.894-4.79 4.66-4.79 1.325 0 2.463.099 2.795.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.312h3.587l-.467 3.623h-3.12V24h6.11c.73 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
