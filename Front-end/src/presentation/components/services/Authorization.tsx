import React from 'react';

const Authorization = () => {
  return (
    <div className="mt-20 px-4">
      <div className="bg-blue-100 text-center p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Error 401 - Not Authorized</h1>
        <br />
        <div className="flex justify-center items-center space-x-2">
          <i className="fas fa-triangle-exclamation text-4xl text-red-600"></i>
          <strong className="text-teal-800 text-xl">Access Denied.</strong>
        </div>
        <br />
        <a href="/" className="inline-block px-6 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          Go to Home pages
        </a>
      </div>
    </div>
  );
};

export default Authorization;
