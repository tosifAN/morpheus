import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 animate-spin"></div>
    </div>
  );
};

export default Loader;
