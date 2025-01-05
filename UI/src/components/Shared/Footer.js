import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-6 mt-8 shadow-lg">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; 2025 <span className="font-semibold text-yellow-300">Form Builder</span>. All rights reserved.
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="text-sm hover:text-yellow-300 transition-all duration-300"
          >
            Privacy Policy
          </a>
          <span className="mx-2 text-gray-400">|</span>
          <a
            href="#"
            className="text-sm hover:text-yellow-300 transition-all duration-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
