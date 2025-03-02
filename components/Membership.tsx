import React from "react";

const Membership = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Unlock Exclusive Skincare Benefits
          </h1>
          <p className="text-xl mb-8">
            Join our membership program and enjoy discounts, early access to new
            products, and personalized skincare recommendations.
          </p>
          <button className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-full hover:bg-purple-100 transition duration-300">
            Join Now
          </button>
        </div>
      </div>

      {/* Membership Benefits Section */}
      <div className="container mx-auto my-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Membership Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-4">Exclusive Discounts</h3>
            <p className="text-gray-600">
              Enjoy up to 30% off on all skincare products.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-4">Early Access</h3>
            <p className="text-gray-600">
              Be the first to try new products before they launch.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-4">Personalized Care</h3>
            <p className="text-gray-600">
              Get tailored skincare recommendations based on your skin type.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300"
                alt="Product 1"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Hydrating Serum</h3>
              <p className="text-gray-600 mb-4">
                Deeply hydrates and plumps your skin.
              </p>
              <button className="bg-purple-500 text-white py-2 px-6 rounded-full hover:bg-purple-600 transition duration-300">
                Add to Cart
              </button>
            </div>

            {/* Product 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300"
                alt="Product 2"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Vitamin C Cream</h3>
              <p className="text-gray-600 mb-4">
                Brightens and evens out skin tone.
              </p>
              <button className="bg-purple-500 text-white py-2 px-6 rounded-full hover:bg-purple-600 transition duration-300">
                Add to Cart
              </button>
            </div>

            {/* Product 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300"
                alt="Product 3"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Sunscreen SPF 50</h3>
              <p className="text-gray-600 mb-4">
                Protects your skin from harmful UV rays.
              </p>
              <button className="bg-purple-500 text-white py-2 px-6 rounded-full hover:bg-purple-600 transition duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl mb-8">
            Join our membership program today and start your journey to
            healthier, glowing skin.
          </p>
          <button className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-full hover:bg-purple-100 transition duration-300">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Membership;
