import { HandCoins, Package, Truck, Users } from "lucide-react";
import React from "react";

const benefits = [
  {
    icon: <Truck size={30} />,
    title: "Fast Delivery Across Afghanistan",
  },
  {
    icon: <HandCoins size={30} />,
    title: "Cash on Delivery",
  },
  {
    icon: <Users size={30} />,
    title: "Support Local Businesses",
  },
  {
    icon: <Package size={30} />,
    title: "Quality Products",
  },
];

const BenfitStacticCards = () => {
  return (
    <>
      <h1 className="text-2xl  font-bold">Why Shop With Us?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 bg-white/10 p-6 sm:p-8 rounded-xl">
        {benefits.map((benf, index) => (
          <div
            key={benf.title}
            className={`flex items-center gap-3 ${index !== benefits.length - 1 ? "lg:border-r lg:border-orange-500/30 lg:pr-4" : ""}`}
          >
            <span className="text-orange-500 bg-orange-500/10 p-2 rounded-full flex-shrink-0">
              {benf.icon}
            </span>
            <span className="text-sm sm:text-base font-mono">{benf.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default BenfitStacticCards;
