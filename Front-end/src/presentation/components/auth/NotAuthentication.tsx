const NotAuthentication: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-red-600">401</h1>
        <p className="text-2xl mt-4 font-semibold">Không có quyền truy cập</p>
        <p className="mt-2 text-gray-600 text-lg">Bạn không có quyền truy cập vào trang này.</p>
        <a href="/app/sign-in" className="mt-6 inline-block px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition text-lg font-medium">
          Hãy đăng nhập
        </a>
      </div>
    </div>
  );
}

export default NotAuthentication;
