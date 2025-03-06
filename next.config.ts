import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "www.laroche-posay.sg",
      "m.media-amazon.com",
      "decaarvietnam.vn",
      "encrypted-tbn3.gstatic.com",
      "product.hstatic.net", // Add this new domain
    ],
  },
};

export default nextConfig;
