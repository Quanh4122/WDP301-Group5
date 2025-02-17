
const NotAuthenticated = () => {
  return (
    <div className="mt-20 px-4">
      <div className="bg-blue-100 text-center p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Error 401 - Not Authenticated</h1>
        <p className="mt-4 text-lg text-gray-600">You need to be logged in to access this page.</p>
        <a 
          href="/app/sign-in"
          className="inline-block mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default NotAuthenticated;
