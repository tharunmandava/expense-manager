import { Outlet } from "react-router-dom"
import Navbar from '../components/Navbar'
import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


export default MainLayout
