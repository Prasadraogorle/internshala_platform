import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";          // Desktop
import MobileNavbar from "./components/MobileNavbar"; // Mobile

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen">
      {/* Condition */}
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <main className="pt-4 px-6"></main>
    </div>
  );
}

export default App;
