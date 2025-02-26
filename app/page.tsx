import About from "@/components/About";
import Hero from "@/components/Hero";
import Products from "./(page)/products/page";
import Nav from "../components/Navbar";

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <Hero />

      <Products />

      <About />
    </div>
  );
};

export default page;
