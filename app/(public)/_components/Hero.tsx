import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2 items-center min-h-[80vh] px-4">
      <div className="flex flex-col">
        <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-sans font-bold leading-tight">
          Find Your Needs From Local Stores
        </h1>
        <p className="md:text-lg text-md pt-4 text-gray-400 max-w-lg">
          Discover electronics, fashion, home essentials, beauty products and
          more from local businesses.
        </p>
        <div className="flex items-center gap-4 mt-6 flex-wrap">
          <Link href="/products">
            <button className="bg-orange-500 text-white rounded-lg py-2.5 px-6 transition-all hover:scale-105 hover:bg-orange-600 duration-300 cursor-pointer font-medium shadow-lg shadow-orange-500/30">
              Start shopping
            </button>
          </Link>
          <Link href="/register">
            <button className="border border-orange-500/50 text-white rounded-lg py-2.5 px-6 transition-all hover:scale-105 hover:bg-orange-500/10 duration-300 cursor-pointer font-medium">
              Open store
            </button>
          </Link>
        </div>
      </div>

      {/* Optional: Add image or illustration here */}
      <div className="hidden md:flex justify-center items-center">
        <div className="w-full h-96 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
          <span className="text-gray-500">Hero Image</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
