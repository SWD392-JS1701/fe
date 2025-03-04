"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaQuestionCircle,
  FaSearch,
  FaGift,
  FaCheckCircle,
} from "react-icons/fa";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function SkinQuizPromo() {
  const router = useRouter();

  return (
    <div className="max-w-[100rem] mx-auto mt-28 mb-10 px-6">
      <h3 className="text-4xl font-extrabold italic text-black uppercase text-center mb-28">
        Key Features
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{
            opacity: [1, 0.85, 1], // Nhẹ nhàng thay đổi ánh sáng
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], // Chuyển động gradient
          }}
          transition={{
            opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            backgroundPosition: {
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="bg-gradient-to-r from-orange-400 via-pink-400 to-blue-200 
             bg-[length:200%_200%] text-white rounded-3xl p-16 flex flex-col justify-center "
        >
          <h2 className="text-5xl font-extrabold mb-8 text-white drop-shadow-2xl">
            Discover Your
            <span className="block text-black relative ">
              Perfect Routine
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-black to-white font-extrabold opacity-70">
                Perfect Routine
              </span>
            </span>
          </h2>

          <p className="text-black/80 text-lg mb-10">
            Take our advanced skin analysis test and receive a personalized
            skincare routine tailored just for you.
          </p>
          <button
            className="px-10 py-5 bg-white text-black text-lg font-semibold rounded-full 
             transition-all duration-400 ease-in-out 
             hover:bg-black hover:text-white cursor-pointer"
            onClick={() => router.push("/quiz")}
          >
            Start Skin Test
          </button>
        </motion.div>
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              text: "Answer quick questions about your skin",
              icon: <FaQuestionCircle className="text-5xl text-black" />,
            },
            {
              text: "Get instant skin type analysis",
              icon: <FaSearch className="text-5xl text-black" />,
            },
            {
              text: "Receive personalized product recommendations",
              icon: <FaGift className="text-5xl text-black" />,
            },
            {
              text: "Follow your custom skincare routine",
              icon: <FaCheckCircle className="text-5xl text-black" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.3,
                ease: "easeOut",
              }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center text-center 
             hover:shadow-2xl transition-all border-[2px] border-gray-300"
            >
              {step.icon}
              <p className="mt-4 text-lg text-gray-800 font-medium">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
