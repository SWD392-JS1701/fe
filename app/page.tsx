import About from "@/components/About";
import Hero from "@/components/Hero";
import Products from "./(root)/(page)/products/page";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

import Footer from "@/components/Footer";
import QuizPromo from "@/components/QuizPromo";

export default async function page () {
    

  return (
    
    <div className="min-h-screen bg-white">
      <NavbarWrapper />
      
      <Hero />

      <QuizPromo />

      <Products />

      <About />

      <Footer />
    </div>
  );
};


