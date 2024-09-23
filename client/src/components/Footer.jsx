import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center text-center">

          {/* Centered content */}
          <div className="flex items-center justify-center md:w-full mt-4 md:mt-0">
            <img src="" alt="Billbuddy Logo" className="p-2 text-sm text-gray-400 pr-6" />
            <a 
              href="https://github.com/tharunmandava/expense-manager" 
              className="text-gray-400 hover:text-white transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.578 0-.287-.01-1.245-.015-2.247-3.338.725-4.043-1.607-4.043-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.09-.745.084-.73.084-.73 1.205.085 1.837 1.236 1.837 1.236 1.07 1.833 2.805 1.302 3.49.996.108-.775.42-1.302.764-1.602-2.665-.303-5.466-1.332-5.466-5.928 0-1.313.47-2.387 1.235-3.23-.125-.303-.535-1.526.115-3.176 0 0 1.008-.322 3.302 1.229a11.48 11.48 0 0 1 3.006-.404c1.02.004 2.04.138 3.006.404 2.294-1.551 3.302-1.229 3.302-1.229.651 1.65.241 2.873.118 3.176.766.843 1.235 1.917 1.235 3.23 0 4.608-2.806 5.623-5.474 5.921.43.372.815 1.103.815 2.224 0 1.606-.015 2.899-.015 3.285 0 .319.218.692.826.578A12.002 12.002 0 0 0 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;