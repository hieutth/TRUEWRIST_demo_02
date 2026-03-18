import { Outlet } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export function Root() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
