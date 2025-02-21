import About from "@/components/About";
import Hero from "@/components/Hero";
import Products from "./(page)/products/page";
import Head from "next/head";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
      <Head>
        <title>GlowUp Skincare</title>
        <meta
          name="description"
          content="Discover the best skincare products for your skin type. Shop now!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <Products />

      <About />
    </div>
  );
};

export default page;
