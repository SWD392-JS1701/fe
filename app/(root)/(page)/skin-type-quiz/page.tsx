import Head from "next/head";
import Link from "next/link";

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-white mt-[70px]">
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
        <h1 className="text-5xl font-bold text-black mb-6">
          Which Skin Type Are You?
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
            they use in their offices and shop for products using your skin
            type!
          </p>
          <p className="font-medium text-lg">
            Take the quiz to change the way you shop for skin care!
          </p>
        </div>

        {/* Button styled to match the image */}
        <Link
          href="/quiz"
          className="bg-black text-white px-8 py-3 rounded-full transition duration-300"
        >
          Find my Skin Type
        </Link>

        {/* Added skin type numbers to match the image */}
        <div className="flex justify-center mt-16 space-x-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-medium bg-blue-400">
            Dry
          </div>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-medium bg-pink-400">
            Oily
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuizPage;
