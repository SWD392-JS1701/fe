import Head from "next/head";
import Link from "next/link";

const QuizQuestionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 mt-[70px]">
      <Head>
        <title>Quiz Questions - GlowUp Skincare</title>
        <meta
          name="description"
          content="Answer the quiz questions to discover your Baumann Skin Type."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Quiz Questions Section */}
      <section className="container mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          Skin Type Quiz
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          {/* Question 1 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-800 mb-4">
              1. How does your skin feel after washing?
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question1"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Tight and dry</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question1"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Smooth and balanced</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question1"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Oily and shiny</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-800 mb-4">
              2. How often do you experience breakouts?
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question2"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Rarely</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question2"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Occasionally</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="question2"
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">Frequently</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300">
              Submit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuizQuestionsPage;
