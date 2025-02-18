const Hero = () => {
  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl font-bold text-purple-800 mb-6">
        Your Journey to Radiant Skin Starts Here
      </h1>
      <p className="text-gray-600 mb-8">
        Discover our premium skincare products tailored for your skin type.
      </p>
      <a
        href="#products"
        className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300"
      >
        Shop Now
      </a>
    </section>
  );
};

export default Hero;
