import Head from "next/head";
import Link from "next/link";

type SkinTypeColors = {
  [key: number]: string;
};

const getTypeColor = (typeNumber: number): string => {
  const colors: SkinTypeColors = {
    1: "bg-pink-500",
    2: "bg-pink-400",
    3: "bg-rose-400",
    4: "bg-orange-400",
    5: "bg-amber-500",
    6: "bg-yellow-400",
    7: "bg-amber-400",
    8: "bg-lime-400",
    9: "bg-green-400",
    10: "bg-emerald-400",
    11: "bg-teal-400",
    12: "bg-cyan-400",
    13: "bg-sky-400",
    14: "bg-blue-400",
    15: "bg-indigo-400",
    16: "bg-violet-400",
  };

  return colors[typeNumber] || "bg-gray-400";
};

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
      <Head>
        <title>Skin Type Quiz - GlowUp Skincare</title>
        <meta
          name="description"
          content="Take the 3-minute skin type quiz to discover your Baumann Skin Type and build a custom skincare routine."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Quiz Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-purple-800 mb-6">
          Which of the 16 Baumann Skin Types® Are You?
        </h1>
        <p className="text-gray-600 mb-8">
          Take the 3-minute skin type quiz now and build a skincare routine with
          medical-grade skincare brands. You will be amazed by how great your
          skin will look!
        </p>

        {/* Added description text */}
        <div className="max-w-3xl mx-auto mb-12 text-gray-600">
          <p className="mb-4">
            Our free skin care routine quiz was developed by dermatologists to
            accurately diagnose your skin type and prescribe a custom skin care
            routine in their medical practices. Now you can use the same quiz
            they use in their offices and shop for products using your Baumann
            Skin Type!
          </p>
          <p className="font-medium text-lg">
            Take the quiz to change the way you shop for skin care!
          </p>
        </div>

        {/* Button styled to match the image */}
        <Link
          href="/quiz"
          className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300"
        >
          Find my Skin Type
        </Link>

        {/* Added skin type numbers to match the image */}
        <div className="flex justify-center mt-16 space-x-2 flex-wrap">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getTypeColor(
                i + 1
              )}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizPage;
