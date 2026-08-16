import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Rocket, Store } from "lucide-react";

const Hero = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:gap-5 md:grid-cols-2 items-center min-h-[80vh] px-4 py-8">
      <div className="flex flex-col order-2 md:order-1">
        <p className="flex items-center gap-2 mb-3 bg-orange-500/10 border text-sm border-orange-500 text-orange-500 w-fit py-1 px-5 rounded-full ">
          <Rocket size={17} />
          Shop Smart.Live Better.
        </p>
        <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-sans font-bold leading-tight">
          Find Your Needs From Local Stores
        </h1>
        <p className="md:text-lg text-md pt-4 text-gray-400 max-w-lg">
          Discover electronics, fashion, home essentials, beauty products and
          more from local businesses.
        </p>
        <div className="flex items-center gap-4 mt-6 flex-wrap">
          <Link href="/products">
            <button className="bg-orange-500 text-white rounded-lg py-2.5 px-6 transition-all hover:scale-105 hover:bg-orange-600 duration-300 cursor-pointer font-medium ">
              Start shopping →
            </button>
          </Link>
          <Link href="/register">
            <button className=" flex gap-2 items-center border border-orange-500/80 text-white rounded-lg py-2.5 px-6 transition-all hover:scale-105 hover:bg-orange-500/10 duration-300 cursor-pointer font-medium">
              Open store <Store size={15} />
            </button>
          </Link>
        </div>
      </div>

      {/* Image visible on all screen sizes */}
      <div className="flex justify-center items-center order-1 md:order-2">
        <div className="w-full max-w-md md:max-w-full h-64 sm:h-72 md:h-96 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <Image
            src="/hero-shopping.jpg"
            alt="Shopping illustration - Find products from local stores"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
