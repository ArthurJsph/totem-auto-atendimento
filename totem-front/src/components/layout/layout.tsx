import { useLocation } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Esconda Navbar e Footer nas rotas de login e registrar
  const hideLayout = ["/login", "/registrar"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}