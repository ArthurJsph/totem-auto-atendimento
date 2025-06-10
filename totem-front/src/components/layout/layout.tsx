import { useLocation, Outlet } from "react-router-dom"; 
import Navbar from "./navbar"; 
import Footer from "./footer"; 

export default function Layout() { 
  const location = useLocation();
  const hideLayout = ["/login", "/registrar"].includes(location.pathname);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!hideLayout && <Navbar />}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet /> 
        </main>
        {!hideLayout && <Footer />}
      </div>
    </>
  );
}