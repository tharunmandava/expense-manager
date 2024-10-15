import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className={`flex-grow ${isHomePage ? 'flex items-center' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
