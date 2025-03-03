const NotAuthentication: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-red-600">401</h1>
        <p className="text-2xl mt-4 font-semibold">Unauthorized Access</p>
        <p className="mt-2 text-gray-600 text-lg">You do not have permission to view this page.</p>
        <a href="/app/sign-in" className="mt-6 inline-block px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition text-lg font-medium">
          Go to Login
        </a>
      </div>
    </div>
  );
}

export default NotAuthentication;
