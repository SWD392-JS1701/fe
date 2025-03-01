"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaQuestionCircle,
  FaSearch,
  FaGift,
  FaCheckCircle,
} from "react-icons/fa";

export default function SkinQuizPromo() {
  const router = useRouter();

  return (
    <div className="max-w-[100rem] mx-auto my-28 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-black text-white rounded-3xl p-16 flex flex-col justify-center"
        >
          <h2 className="text-5xl font-extrabold mb-8">
            Discover Your
            <span className="block">Perfect Routine</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Take our advanced skin analysis test and receive a personalized
            skincare routine tailored just for you.
          </p>
          <button
            className="px-10 py-5 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-300 transition"
            onClick={() => router.push("/skin-quiz")}
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
                duration: 1.2,
                delay: index * 0.3,
                ease: "easeOut",
              }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all"
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
