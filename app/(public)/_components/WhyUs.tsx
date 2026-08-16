import {
  Check,
  Package,
  Rocket,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const WhyUs = () => {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Create your store in minutes",
      description: "No technical skills needed",
    },
    {
      icon: <Package className="w-5 h-5" />,
      text: "Manage products and inventory",
      description: "Track stock in real-time",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      text: "Receive orders instantly",
      description: "Get notified on every sale",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      text: "Assign delivery to drivers",
      description: "End-to-end delivery management",
    },
  ];

  return (
    <div className="text-orange-500 bg-orange-100 p-5 rounded-lg">
      <h1 className=" text-xl md:text-4xl text-gray-900 flex gap-2 items-center font-semibold">
        <span className=" text-orange-500">
          <Rocket className=" w-8 md:h-20 md:w-11" />
        </span>
        Start Selling Across
        <span className=" text-orange-500">Afghanistan</span>
      </h1>
      <h1 className="group text-sm md:text-[17px] bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 rounded-xl p-4 border border-orange-100/50 hover:border-orange-300 flex items-start gap-3 cursor-default mb-5">
        Reach thousands of customers without relying on Whatsapp. Create your
        own online store and manage everything from one dashboard.
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 rounded-xl p-4 border border-orange-100/50 hover:border-orange-300 flex items-start gap-3 cursor-default"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center text-orange-600 transition-colors duration-300">
              {feature.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm md:text-base flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                {feature.text}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Link
          href={"/register"}
          className=" group flex gap-2 items-center mt-5 transition-all duration-500 rounded-lg hover:scale-105  hover:bg-orange-600 bg-orange-500 text-white px-4 py-2"
        >
          <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Create Your Store
        </Link>
      </div>
    </div>
  );
};

export default WhyUs;
