"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QuizQuestion from "@/components/QuizQuestion";
import { questions } from "@/app/data/quizQuestions";
import { getProductsBySkinType } from "@/app/services/productService";
import { updateUser, getUserById } from "@/app/services/userService";
import { Product } from "@/app/types/product";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

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
              <h2 className="text-2xl font-bold text-black mb-4">
                Your Skin Type
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                Your skin type is <span className="font-bold">{skinType}</span>.
              </p>
              <p className="text-gray-600 mb-2">
                {skinType === "Dry"
                  ? "Your skin tends to be dry and may need extra moisture and gentle care."
                  : "Your skin produces more oil and may need oil-control products."}
              </p>
              {savingResult && (
                <p className="text-sm text-gray-500 italic">
                  Saving result to your profile...
                </p>
              )}
              {!session && (
                <p className="text-sm text-gray-500 mt-2">
                  Sign in to save your skin type result to your profile!
                </p>
              )}
            </div>

            {/* Recommended Products */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                Recommended Products for {skinType} Skin
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                  <p>Loading recommended products...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">{error}</div>
              ) : recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No products available at the moment.
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                className="bg-black text-white px-6 py-2 rounded-full transition duration-300"
                onClick={async () => {
                  if (session?.user) {
                    try {
                      // Set skin type to empty string to clear it
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
                  // Reset quiz state
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setSkinType(null);
                  setRecommendedProducts([]);
                  setError(null);
                  // Force a profile check to update the UI
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
