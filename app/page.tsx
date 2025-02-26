import About from "@/components/About";
import Hero from "@/components/Hero";
import Products from "./(root)/(page)/products/page";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Hero />

      <Products />

      <About />

      <Footer />
    </div>
  );
};

export default page;
