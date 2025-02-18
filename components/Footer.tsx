import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTruck,
  FaBook,
  FaPiggyBank,
  FaStar,
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaRedditAlien,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* Top Section */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full border border-blue-400 p-4 inline-flex mb-3">
                <FaTruck className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-blue-600 font-medium">Free Shipping</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full border border-blue-400 p-4 inline-flex mb-3">
                <FaBook className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-blue-600 font-medium">Skincare Library</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full border border-blue-400 p-4 inline-flex mb-3">
                <FaPiggyBank className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-blue-600 font-medium">
                Subscribe &<br />
                Save
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full border border-blue-400 p-4 inline-flex mb-3">
                <FaStar className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-blue-600 font-medium">Rewards</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          {/* Footer Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Company Information */}
            <div>
              <Image
                src="/logo.png"
                alt="SkinType Solutions"
                width={150}
                height={40}
                className="mb-6"
              />
              <p className="text-sm text-gray-600 mb-6">
                AUTHORIZED RETAILER OF ALL BRANDS - 100% PRODUCT AUTHENTICITY
                GUARANTEED
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Skin Type Solutions does not provide medical advice. Information
                on this website is provided for educational purposes and does
                not create a doctor-patient relationship. Skin Type Concierge
                powered by AI does not provide medical advice.
              </p>
              <div className="mb-4">
                <p className="text-sm text-gray-600 flex items-center mb-2">
                  <span className="font-semibold mr-2">Phone:</span>
                  <a
                    href="tel:888-756-8973"
                    className="text-blue-600 hover:underline"
                  >
                    888-756-8973
                  </a>
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-semibold mr-2">Email:</span>
                  <a
                    href="mailto:support@skintypesolutions.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@skintypesolutions.com
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Links - Column 1 */}
            <div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affiliate"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/earn-rewards"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Earn Rewards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links - Column 2 */}
            <div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authorized-retailer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Authorized Retailer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/skin-care-library"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Skin Care Library
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quiz"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Take the Quiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/physicians-enroll"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Physicians: Enroll in STS+
                  </Link>
                </li>
                <li>
                  <Link
                    href="/physicians-login"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Physicians: STS+ Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
            {/* Copyright */}
            <div className="flex justify-center md:justify-end">
              <p className="text-sm text-gray-500">
                Copyright © Skin Type Solutions 2025
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-4">
              <Link
                href="https://instagram.com/skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaInstagram className="text-xl" />
              </Link>
              <Link
                href="https://tiktok.com/@skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaTiktok className="text-xl" />
              </Link>
              <Link
                href="https://facebook.com/skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaFacebookF className="text-xl" />
              </Link>
              <Link
                href="https://pinterest.com/skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaPinterestP className="text-xl" />
              </Link>
              <Link
                href="https://youtube.com/skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaYoutube className="text-xl" />
              </Link>
              <Link
                href="https://reddit.com/r/skintypesolutions"
                className="text-gray-500 hover:text-blue-600"
              >
                <FaRedditAlien className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
