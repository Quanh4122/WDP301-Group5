const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
        <p className="text-2xl mt-4 font-semibold">Oops! Page not found</p>
        <p className="mt-2 text-gray-600 text-lg">The page you are looking for doesn't exist or has been moved.</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-lg font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
