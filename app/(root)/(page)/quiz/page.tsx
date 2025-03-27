"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QuizQuestion from "@/components/QuizQuestion";
import { questions } from "@/app/data/quizQuestions";
import { getProductsBySkinType } from "@/app/services/productService";
import { updateUser, getUserById } from "@/app/services/userService";
import { Product } from "@/app/types/product";
import LetterProductCard from "../../../components/LetterProductCard";
import { toast } from "sonner";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animated section component
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated routine step component
const AnimatedRoutineStep = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUp}
    className={className}
  >
    {children}
  </motion.div>
);

const QuizQuestionsPage = () => {
  const { data: session, status } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [skinType, setSkinType] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingResult, setSavingResult] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [morningAnimation, setMorningAnimation] = useState<any>(null);
  const [nightAnimation, setNightAnimation] = useState<any>(null);

  // Check for existing skin type in profile when page loads
  useEffect(() => {
    const checkExistingSkinType = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        setCheckingProfile(false);
        return;
      }

      try {
        const userProfile = await getUserById(session);

        if (userProfile?.skinType) {
          setSkinType(userProfile.skinType);
          // Fetch recommended products for existing skin type
          setLoading(true);
          const products = await getProductsBySkinType(userProfile.skinType);
          if (products.length === 0) {
            setError(
              "No products found for your skin type. We're working on adding more!"
            );
          }
          setRecommendedProducts(products.slice(0, 4));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingSkinType();
  }, [session, status]);

  // Load animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch morning animation
      fetch("/morning.json")
        .then((response) => response.json())
        .then((data) => setMorningAnimation(data))
        .catch((error) =>
          console.error("Error loading morning animation:", error)
        );

      // Fetch night animation
      fetch("/night.json")
        .then((response) => response.json())
        .then((data) => setNightAnimation(data))
        .catch((error) =>
          console.error("Error loading night animation:", error)
        );
    }
  }, []);

  const handleAnswer = (questionId: number, selectedAnswers: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswers,
    }));
  };

  const saveQuizResult = async (skinTypeResult: string) => {
    if (status === "loading") {
      console.log("Session is still loading, waiting...");
      return;
    }

    if (!session?.user) {
      console.log("User not logged in, skipping result save");
      return;
    }

    console.log("Full session:", session);
    console.log("Session user:", session.user);

    setSavingResult(true);
    try {
      const userId = session.user.id;
      console.log("Using user ID:", userId);

      const result = await updateUser(userId, {
        skinType: skinTypeResult,
      });

      console.log("Update result:", result);

      if (result) {
        toast.success("Skin type saved to your profile!");
      } else {
        toast.error("Failed to save skin type to your profile");
      }
    } catch (error) {
      console.error("Error saving skin type:", error);
      toast.error("Failed to save skin type to your profile");
    } finally {
      setSavingResult(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate skin type when quiz is complete
      const totals = {
        Dry: 0,
        Oily: 0,
      };

      // Sum points for each answer
      Object.entries(answers).forEach(([qId, ans]) => {
        const q = questions.find((q) => q.id === parseInt(qId));
        ans.forEach((a) => {
          const answer = q?.answers.find((aObj) => aObj.text === a);
          if (answer) {
            Object.entries(answer.points).forEach(([key, value]) => {
              totals[key as keyof typeof totals] += value;
            });
          }
        });
      });

      // Determine skin type based on highest score
      const skinTypeResult = totals.Dry > totals.Oily ? "Dry" : "Oily";
      setSkinType(skinTypeResult);

      // Save result to user profile if session is loaded
      if (status === "authenticated") {
        await saveQuizResult(skinTypeResult);
      }

      // Fetch recommended products
      setLoading(true);
      setError(null);
      try {
        const products = await getProductsBySkinType(skinTypeResult);
        console.log("Fetched products:", products);
        if (products.length === 0) {
          setError(
            "No products found for your skin type. We're working on adding more!"
          );
        }
        setRecommendedProducts(products.slice(0, 4)); // Get 4 products
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        setError(
          "Failed to load product recommendations. Please try again later."
        );
      }
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Title component with animation
  const RoutineTitle = ({ icon, title }: { icon: any; title: string }) => (
    <div className="flex justify-center items-center mb-16">
      <div className="flex items-center gap-6">
        <div className="w-[120px] h-[120px] flex items-center justify-center">
          {typeof window !== "undefined" && icon && (
            <Lottie
              animationData={icon}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
        <h3 className="text-6xl font-cursive text-[#4a3e36] text-center">
          {title}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white mt-[70px]">
      <Head>
        <title>Quiz Questions - GlowUp Skincare</title>
        <meta
          name="description"
          content="Answer the quiz questions to discover your skin type and get personalized product recommendations."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Quiz Container */}
      <section className="container mx-auto px-6 py-12 mt-30">
        {checkingProfile ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        ) : skinType ? (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xl font-handwriting text-gray-700 mb-4">
                Your skin type is{" "}
                <span className="font-bold text-2xl text-[#4a3e36] bg-[#f9e4c8] px-4 py-1 rounded-full">
                  {skinType}
                </span>
              </p>
              <p className="text-gray-600 mb-2 font-handwriting">
                {skinType === "Dry"
                  ? "Your skin tends to be dry and may need extra moisture and gentle care."
                  : "Your skin produces more oil and may need oil-control products."}
              </p>
              <h1 className="font-cursive text-3xl mb-4">
                Your Personal Skincare Letter
              </h1>
              {savingResult && (
                <p className="text-sm text-gray-500 italic font-handwriting">
                  Saving result to your profile...
                </p>
              )}
              {!session && (
                <div className="bg-[#f9e4c8] p-4 rounded-lg inline-block mt-2">
                  <p className="text-[#4a3e36] font-handwriting text-lg">
                    ✨ Sign in to save your skin type result to your profile! ✨
                  </p>
                </div>
              )}
            </div>

            {skinType === "Dry" ? (
              <motion.div
                className="space-y-12 bg-[#f5e6d3] p-8 rounded-lg shadow-inner"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 29px, #e5d5c5 30px)",
                  backgroundSize: "100% 30px",
                  borderRadius: "12px",
                  border: "1px solid #e5d5c5",
                }}
              >
                {/* Morning Routine */}
                <AnimatedSection>
                  <RoutineTitle
                    icon={morningAnimation}
                    title="Morning Skincare Routine for Dry Skin"
                  />

                  {/* Step 1: Cleanser */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        1️⃣ Gentle Hydrating Cleanser
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Essential Step
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Cleanses the skin while maintaining moisture balance.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Glycerin, ceramides, hyaluronic acid, aloe vera.
                        </p>
                        <p className="font-semibold mb-2">🔹 Avoid:</p>
                        <p className="mb-2">
                          Sulfates, alcohol-based cleansers, and strong foaming
                          agents.
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>
                            Splash your face with lukewarm water (hot water can
                            strip moisture).
                          </li>
                          <li>
                            Apply a nickel-sized amount of cleanser to your
                            hands.
                          </li>
                          <li>
                            Gently massage into your skin in circular motions
                            for 30-60 seconds.
                          </li>
                          <li>Rinse thoroughly with lukewarm water.</li>
                          <li>Pat dry with a soft towel (do not rub!).</li>
                        </ol>
                      </div>
                    </div>
                    <div className="w-1/3">
                      {recommendedProducts[0] && (
                        <LetterProductCard product={recommendedProducts[0]} />
                      )}
                    </div>
                  </AnimatedRoutineStep>

                  {/* Step 2: Toner */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="w-1/3">
                      {recommendedProducts[1] && (
                        <LetterProductCard product={recommendedProducts[1]} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        2️⃣ Hydrating Toner
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Boosts Hydration
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Preps the skin, restores pH balance, and enhances
                          absorption of the next products.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Rose water, hyaluronic acid, niacinamide, panthenol.
                        </p>
                        <p className="font-semibold mb-2">🔹 Avoid:</p>
                        <p className="mb-2">
                          Alcohol-based toners, witch hazel (can be drying).
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>
                            Pour a few drops onto your palms or a cotton pad.
                          </li>
                          <li>Press gently into the skin (do not rub).</li>
                          <li>
                            Let it absorb for 30 seconds before the next step.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </AnimatedRoutineStep>

                  {/* Step 3: Moisturizer */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        3️⃣ Moisturizer
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Locks in Hydration
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Strengthens the skin barrier, prevents dryness, and
                          smooths skin texture.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Ceramides, shea butter, squalane, fatty acids.
                        </p>
                        <p className="font-semibold mb-2">🔹 Avoid:</p>
                        <p className="mb-2">
                          Lightweight gel moisturizers (they may not provide
                          enough hydration).
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>
                            Take a pea-sized amount (for lightweight lotions) or
                            a dime-sized amount (for thicker creams).
                          </li>
                          <li>Warm it between your fingers.</li>
                          <li>
                            Apply evenly over your face and neck using upward
                            motions.
                          </li>
                          <li>
                            Focus on extra dry areas, like around the nose and
                            cheeks.
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="w-1/3">
                      {recommendedProducts[2] && (
                        <LetterProductCard product={recommendedProducts[2]} />
                      )}
                    </div>
                  </AnimatedRoutineStep>

                  {/* Step 4: Sunscreen */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="w-1/3">
                      {recommendedProducts[3] && (
                        <LetterProductCard product={recommendedProducts[3]} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        4️⃣ Sunscreen
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Protects from UV Damage
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Shields skin from harmful UV rays, prevents premature
                          aging and moisture loss.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Zinc oxide, titanium dioxide, niacinamide, squalane.
                        </p>
                        <p className="font-semibold mb-2">🔹 Avoid:</p>
                        <p className="mb-2">
                          Alcohol-heavy sunscreens, chemical sunscreens with
                          oxybenzone (can be irritating).
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>
                            Take a generous amount (about ½ teaspoon for the
                            face).
                          </li>
                          <li>Apply evenly across your face and neck.</li>
                          <li>Wait 5-10 minutes before applying makeup.</li>
                          <li>Reapply every 2 hours if exposed to sunlight.</li>
                        </ol>
                      </div>
                    </div>
                  </AnimatedRoutineStep>
                </AnimatedSection>

                {/* Night Routine */}
                <AnimatedSection>
                  <RoutineTitle
                    icon={nightAnimation}
                    title="Night Skincare Routine for Dry Skin"
                  />

                  {/* Night Step 1: Cleanser */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        1️⃣ Gentle Hydrating Cleanser
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Essential Step
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Removes makeup, dirt, and oil while keeping the skin
                          hydrated.
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <p className="mb-2">
                          Follow the same steps as the morning routine.
                        </p>
                        <p className="font-semibold mb-2">💡 Tip:</p>
                        <p className="mb-2">
                          If wearing makeup or sunscreen, use a cleansing balm
                          or oil cleanser first before your hydrating cleanser
                          (double cleansing).
                        </p>
                      </div>
                    </div>
                    <div className="w-1/3">
                      {recommendedProducts[0] && (
                        <LetterProductCard product={recommendedProducts[0]} />
                      )}
                    </div>
                  </AnimatedRoutineStep>

                  {/* Night Step 2: Toner */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="w-1/3">
                      {recommendedProducts[1] && (
                        <LetterProductCard product={recommendedProducts[1]} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        2️⃣ Hydrating Toner
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Prepares Skin for Moisture
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Helps maintain skin hydration overnight.
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <p className="mb-2">
                          Follow the same steps as the morning routine.
                        </p>
                        <p className="font-semibold mb-2">💡 Tip:</p>
                        <p className="mb-2">
                          Apply two layers of toner if your skin feels extra dry
                          (also known as the "7 Skin Method").
                        </p>
                      </div>
                    </div>
                  </AnimatedRoutineStep>

                  {/* Night Step 3: Moisturizer */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        3️⃣ Moisturizer
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        Deep Hydration
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Replenishes lost moisture, repairs the skin barrier,
                          and locks in hydration.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Peptides, ceramides, argan oil, hyaluronic acid.
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>
                            Take a dime-sized amount and warm it between your
                            hands.
                          </li>
                          <li>
                            Gently press onto your skin using patting motions
                            (avoid rubbing).
                          </li>
                          <li>
                            Apply an extra layer on dry areas like cheeks and
                            forehead.
                          </li>
                          <li>
                            Let it absorb fully before lying down to avoid
                            product transfer.
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="w-1/3">
                      {recommendedProducts[2] && (
                        <LetterProductCard product={recommendedProducts[2]} />
                      )}
                    </div>
                  </AnimatedRoutineStep>

                  {/* Night Step 4: Overnight Mask */}
                  <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                    <div className="w-1/3">
                      {recommendedProducts[3] && (
                        <LetterProductCard product={recommendedProducts[3]} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                        4️⃣ Overnight Hydrating Mask
                      </h4>
                      <p className="font-handwriting text-[#6b5d53] mb-2">
                        2-3 times per week
                      </p>
                      <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                        <p className="font-semibold mb-2">🔹 Purpose:</p>
                        <p className="mb-2">
                          Provides intense hydration while you sleep.
                        </p>
                        <p className="font-semibold mb-2">
                          🔹 Recommended Ingredients:
                        </p>
                        <p className="mb-2">
                          Honey, oat extract, panthenol, centella asiatica.
                        </p>
                      </div>
                      <div className="bg-[#fff9f2] p-4 rounded-lg">
                        <p className="font-semibold mb-2">💡 How to Use:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Apply a thin layer over your moisturizer.</li>
                          <li>Leave it overnight.</li>
                          <li>Rinse off in the morning with lukewarm water.</li>
                        </ol>
                      </div>
                    </div>
                  </AnimatedRoutineStep>

                  {/* Extra Tips */}
                  <AnimatedRoutineStep className="bg-[#fff9f2] p-6 rounded-lg">
                    <h4 className="text-xl font-cursive text-[#4a3e36] mb-4">
                      💡 Extra Tips for Dry Skin
                    </h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Drink at least 2L of water per day to keep skin hydrated
                        from within.
                      </li>
                      <li>Use a humidifier in your room to prevent dryness.</li>
                      <li>
                        Avoid hot showers (they strip moisture from your skin).
                      </li>
                      <li>
                        Apply products on damp skin for better absorption.
                      </li>
                      <li>
                        Exfoliate gently (1-2 times a week) using a mild
                        chemical exfoliant like lactic acid (avoid scrubs).
                      </li>
                    </ul>
                  </AnimatedRoutineStep>
                </AnimatedSection>
              </motion.div>
            ) : (
              skinType === "Oily" && (
                <motion.div
                  className="space-y-12 bg-[#f5e6d3] p-8 rounded-lg shadow-inner"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 29px, #e5d5c5 30px)",
                    backgroundSize: "100% 30px",
                    borderRadius: "12px",
                    border: "1px solid #e5d5c5",
                  }}
                >
                  {/* Morning Routine */}
                  <AnimatedSection>
                    <RoutineTitle
                      icon={morningAnimation}
                      title="Morning Skincare Routine for Oily Skin"
                    />

                    {/* Step 1: Cleanser */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          1️⃣ Cleanser
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Choose a Gel or Foam-Based Cleanser
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Removes excess oil, dirt, and bacteria to prevent
                            clogged pores.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            Salicylic acid, niacinamide, tea tree oil.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">
                            Heavy cream-based cleansers that may feel greasy on
                            oily skin.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>
                              Wash your face with lukewarm water to avoid excess
                              sebum production.
                            </li>
                            <li>Take a nickel-sized amount of cleanser.</li>
                            <li>
                              Massage gently in circular motions for 30-60
                              seconds (focus on oily areas like T-zone).
                            </li>
                            <li>
                              Rinse thoroughly and pat dry with a clean towel.
                            </li>
                          </ol>
                        </div>
                      </div>
                      <div className="w-1/3">
                        {recommendedProducts[0] && (
                          <LetterProductCard product={recommendedProducts[0]} />
                        )}
                      </div>
                    </AnimatedRoutineStep>

                    {/* Step 2: Vitamin C Serum */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="w-1/3">
                        {recommendedProducts[1] && (
                          <LetterProductCard product={recommendedProducts[1]} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          2️⃣ Brightening Vitamin C Serum
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Controls Oil & Brightens Skin
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Helps with oil control, evens skin tone, and
                            provides antioxidant protection.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            Vitamin C, niacinamide, ferulic acid.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">Heavy or oil-based serums.</p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Take 2-3 drops of the serum.</li>
                            <li>
                              Gently press into the skin (don&apos;t rub).
                            </li>
                            <li>
                              Wait 30 seconds to 1 minute before applying the
                              next product.
                            </li>
                          </ol>
                          <p className="font-semibold mb-2 mt-2">💡 Tip:</p>
                          <p className="mb-2">
                            Store vitamin C serum in a cool, dark place to
                            prevent oxidation.
                          </p>
                        </div>
                      </div>
                    </AnimatedRoutineStep>

                    {/* Step 3: Aloe Gel */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          3️⃣ Soothing Aloe Gel
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Lightweight Moisturizer
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Hydrates without clogging pores and soothes
                            inflammation.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            100% pure aloe vera, green tea extract, allantoin.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">
                            Aloe gels with alcohol, fragrance, or artificial
                            colors.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Take a pea-sized amount of aloe gel.</li>
                            <li>
                              Gently apply a thin layer all over your face.
                            </li>
                            <li>
                              Let it fully absorb before applying sunscreen.
                            </li>
                          </ol>
                          <p className="font-semibold mb-2 mt-2">💡 Tip:</p>
                          <p className="mb-2">
                            If your skin gets too oily during the day,
                            refrigerate the gel before applying for a cooling
                            effect.
                          </p>
                        </div>
                      </div>
                      <div className="w-1/3">
                        {recommendedProducts[2] && (
                          <LetterProductCard product={recommendedProducts[2]} />
                        )}
                      </div>
                    </AnimatedRoutineStep>

                    {/* Step 4: Sunscreen */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="w-1/3">
                        {recommendedProducts[3] && (
                          <LetterProductCard product={recommendedProducts[3]} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          4️⃣ Sunscreen
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          SPF 30+ Broad Spectrum
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Prevents sun damage, dark spots, and premature
                            aging.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            Zinc oxide, niacinamide, lightweight gel formulas.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">
                            Heavy, greasy sunscreens with coconut oil or shea
                            butter.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>
                              Apply a generous amount (about ½ teaspoon for the
                              face).
                            </li>
                            <li>Spread evenly across face and neck.</li>
                            <li>Wait 5-10 minutes before applying makeup.</li>
                            <li>
                              Reapply every 2 hours if exposed to the sun.
                            </li>
                          </ol>
                          <p className="font-semibold mb-2 mt-2">💡 Tip:</p>
                          <p className="mb-2">
                            Choose an oil-free or mattifying sunscreen to keep
                            shine under control.
                          </p>
                        </div>
                      </div>
                    </AnimatedRoutineStep>
                  </AnimatedSection>

                  {/* Night Routine */}
                  <AnimatedSection>
                    <RoutineTitle
                      icon={nightAnimation}
                      title="Night Skincare Routine for Oily Skin"
                    />

                    {/* Night Step 1: Cleanser */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          1️⃣ Cleanser
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Same as Morning Routine
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Removes oil, dirt, and pollution from the day.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <p className="mb-2">
                            Follow the same steps as in the morning routine.
                          </p>
                          <p className="font-semibold mb-2">💡 Tip:</p>
                          <p className="mb-2">
                            If you wore makeup or sunscreen, use double
                            cleansing (oil-based cleanser first, then
                            water-based cleanser).
                          </p>
                        </div>
                      </div>
                      <div className="w-1/3">
                        {recommendedProducts[0] && (
                          <LetterProductCard product={recommendedProducts[0]} />
                        )}
                      </div>
                    </AnimatedRoutineStep>

                    {/* Night Step 2: Exfoliating Scrub */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="w-1/3">
                        {recommendedProducts[1] && (
                          <LetterProductCard product={recommendedProducts[1]} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          2️⃣ Exfoliating Facial Scrub
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          2-3 times per week, NOT daily
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Removes dead skin cells, prevents clogged pores, and
                            reduces excess oil.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            Salicylic acid, charcoal, tea tree oil.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">
                            Harsh scrubs with large beads that can damage skin.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>
                              After cleansing, take a pea-sized amount of scrub.
                            </li>
                            <li>
                              Gently massage in circular motions for 30 seconds
                              (avoid over-scrubbing).
                            </li>
                            <li>Rinse with lukewarm water and pat dry.</li>
                            <li>Follow with toner and moisturizer.</li>
                          </ol>
                          <p className="font-semibold mb-2 mt-2">💡 Tip:</p>
                          <p className="mb-2">
                            If you use chemical exfoliants (like BHA) in your
                            routine, reduce physical exfoliation to once a week.
                          </p>
                        </div>
                      </div>
                    </AnimatedRoutineStep>

                    {/* Night Step 3: Aloe Gel */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          3️⃣ Soothing Aloe Gel
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Nighttime Moisturizer
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Hydrates, calms, and prevents skin irritation.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <p className="mb-2">Same as morning routine.</p>
                          <p className="font-semibold mb-2">💡 Tip:</p>
                          <p className="mb-2">
                            If your skin is very oily at night, apply a thin
                            layer only on dry areas.
                          </p>
                        </div>
                      </div>
                      <div className="w-1/3">
                        {recommendedProducts[2] && (
                          <LetterProductCard product={recommendedProducts[2]} />
                        )}
                      </div>
                    </AnimatedRoutineStep>

                    {/* Night Step 4: Sheet Mask */}
                    <AnimatedRoutineStep className="flex items-start gap-8 mb-8">
                      <div className="w-1/3">
                        {recommendedProducts[3] && (
                          <LetterProductCard product={recommendedProducts[3]} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-cursive text-[#4a3e36] mb-2">
                          4️⃣ Hydrating Sheet Mask
                        </h4>
                        <p className="font-handwriting text-[#6b5d53] mb-2">
                          Once a Week, Instead of Aloe Gel
                        </p>
                        <div className="bg-[#fff9f2] p-4 rounded-lg mb-4 border border-[#e5d5c5]">
                          <p className="font-semibold mb-2">🔹 Purpose:</p>
                          <p className="mb-2">
                            Provides an extra boost of hydration without
                            heaviness.
                          </p>
                          <p className="font-semibold mb-2">
                            🔹 Recommended Ingredients:
                          </p>
                          <p className="mb-2">
                            Hyaluronic acid, green tea, niacinamide.
                          </p>
                          <p className="font-semibold mb-2">🔹 Avoid:</p>
                          <p className="mb-2">
                            Masks with excessive fragrance or alcohol.
                          </p>
                        </div>
                        <div className="bg-[#fff9f2] p-4 rounded-lg">
                          <p className="font-semibold mb-2">💡 How to Use:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>
                              Apply the sheet mask after cleansing and before
                              moisturizer.
                            </li>
                            <li>Leave on for 15-20 minutes.</li>
                            <li>
                              Remove and gently pat the excess essence into the
                              skin (do not rinse).
                            </li>
                            <li>Follow with aloe gel as your final step.</li>
                          </ol>
                          <p className="font-semibold mb-2 mt-2">💡 Tip:</p>
                          <p className="mb-2">
                            Store the mask in the fridge for a cooling,
                            anti-inflammatory effect.
                          </p>
                        </div>
                      </div>
                    </AnimatedRoutineStep>

                    {/* Extra Tips */}
                    <AnimatedRoutineStep className="bg-[#fff9f2] p-6 rounded-lg">
                      <h4 className="text-xl font-cursive text-[#4a3e36] mb-4">
                        💡 Extra Tips for Oily Skin
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          Blot excess oil throughout the day with blotting
                          papers.
                        </li>
                        <li>
                          Drink plenty of water to balance oil production.
                        </li>
                        <li>
                          Use a lightweight, gel-based moisturizer instead of
                          heavy creams.
                        </li>
                        <li>
                          Avoid over-washing your face (it can cause your skin
                          to produce even more oil).
                        </li>
                        <li>
                          Use oil-absorbing clay masks (like kaolin or
                          bentonite) once a week.
                        </li>
                        <li>Keep pillowcases clean to prevent breakouts.</li>
                      </ul>
                    </AnimatedRoutineStep>
                  </AnimatedSection>
                </motion.div>
              )
            )}

            <div className="text-center mt-8">
              <button
                className="bg-[#4a3e36] text-white px-6 py-2 rounded-full transition duration-300 font-handwriting hover:bg-[#6b5d53]"
                onClick={async () => {
                  if (session?.user) {
                    try {
                      await updateUser(session.user.id, {
                        skinType: "",
                      });
                      toast.success("Quiz reset successfully!");
                    } catch (error) {
                      console.error("Error resetting quiz:", error);
                      toast.error("Failed to reset quiz. Please try again.");
                      return;
                    }
                  }
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setSkinType(null);
                  setRecommendedProducts([]);
                  setError(null);
                  setCheckingProfile(true);
                }}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-8">
              Answer the following questions to discover your skin type and get
              personalized product recommendations.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
              <div
                className="bg-black h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>

            {/* Current Question */}
            <QuizQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />

            {/* Navigation Info */}
            <div className="text-center mt-4 text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default QuizQuestionsPage;
