const Products = () => {
  return (
    <section id="products" className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-purple-800 mb-12 text-center">
        Our Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/cleanser.jpg"
            alt="Cleanser"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <h3 className="text-xl font-bold text-purple-800 mt-4">
            Gentle Cleanser
          </h3>
          <p className="text-gray-600 mt-2">
            Perfect for daily use to remove impurities.
          </p>
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">
            Add to Cart
          </button>
        </div>
        {/* Product Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/moisturizer.jpg"
            alt="Moisturizer"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <h3 className="text-xl font-bold text-purple-800 mt-4">
            Hydrating Moisturizer
          </h3>
          <p className="text-gray-600 mt-2">
            Keeps your skin hydrated all day long.
          </p>
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">
            Add to Cart
          </button>
        </div>
        {/* Product Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/serum.jpg"
            alt="Serum"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <h3 className="text-xl font-bold text-purple-800 mt-4">
            Anti-Aging Serum
          </h3>
          <p className="text-gray-600 mt-2">Reduces fine lines and wrinkles.</p>
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
