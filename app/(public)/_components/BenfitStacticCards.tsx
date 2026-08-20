import { HandCoins, Package, Truck, Users } from "lucide-react";
import React from "react";

const benefits = [
  {
    icon: <Truck size={24} />,
    title: "Fast Delivery Across Afghanistan",
  },
  {
    icon: <HandCoins size={24} />,
    title: "Cash on Delivery",
  },
  {
    icon: <Users size={24} />,
    title: "Support Local Businesses",
  },
  {
    icon: <Package size={24} />,
    title: "Quality Products",
  },
];

const BenfitStacticCards = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Why Shop With Us?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benf, index) => (
          <div
            key={benf.title}
            className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 rounded-2xl flex items-center justify-center text-orange-500 group-hover:text-orange-600 transition-all duration-300 mb-3 shadow-sm group-hover:shadow">
                {benf.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">
                {benf.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenfitStacticCards;
