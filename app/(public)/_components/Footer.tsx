import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-10 pt-8 text-gray-600 text-sm">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <p className="text-2xl font-bold text-orange-500">XROW</p>
            <p className="w-full max-w-xs mt-2 text-gray-500 leading-relaxed">
              Connecting buyers and sellers across Afghanistan with a simple
              reliable shopping experience
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-orange-500 font-semibold">Shop</h1>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Categories
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Top Products
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Featured Products
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Top Stores
            </p>
          </div>

          {/* Seller */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-orange-500 font-semibold">Seller</h1>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Become a Seller
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Seller Guide
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Pricing
            </p>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-orange-500 font-semibold">Company</h1>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              About Us
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Contact Us
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-orange-500 font-semibold">Contact</h1>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Email Us: Xrow@support.com
            </p>
            <p className="hover:text-orange-500 cursor-pointer transition-colors">
              Call Us: 07********
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <p className="text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} XROW. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
