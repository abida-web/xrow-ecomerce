import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 mt-10 py-6 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} Your Store. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
