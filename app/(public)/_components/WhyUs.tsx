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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-12">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm border border-orange-100 text-orange-600 px-5 py-2 rounded-full text-sm font-medium mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Start Selling Across{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Afghanistan
              </span>
              <svg
                className="absolute bottom-1 left-0 w-full h-3 text-orange-200/50 -z-0"
                viewBox="0 0 200 10"
                fill="currentColor"
              >
                <path
                  d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Reach thousands of customers without relying on WhatsApp. Create
            your own online store and manage everything from one powerful
            dashboard.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 group-hover:to-orange-100 rounded-2xl flex items-center justify-center text-orange-600 transition-all duration-300 shadow-sm group-hover:shadow">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    {feature.text}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
              Ready to Start Your Journey?
            </h3>
            <p className="text-orange-100 mb-6 max-w-lg mx-auto">
              Join thousands of sellers already growing their business with us
            </p>
            <Link
              href={"/register"}
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25 group"
            >
              <Rocket className="w-5 h-5 group-hover:animate-bounce" />
              Create Your Store Now
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <p className="text-orange-200/80 text-sm mt-4">
              🚀 Free to start • No hidden fees • 24/7 support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
