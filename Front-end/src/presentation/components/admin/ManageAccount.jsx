import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchPendingDriverApplications,
  ApproveDriverApplication,
} from "../redux/slices/Authentication";

const ManageAccount = () => {
  const dispatch = useDispatch();
  const {
    pendingDriverApplications = [],
    isLoading = false,
    user = null,
  } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (user?.role === "Admin") {
      dispatch(FetchPendingDriverApplications());
    }
  }, [dispatch, user?.role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          <span className="text-lg text-gray-700 font-medium">
            Loading Applications...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mb-40 bg-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Account Management Dashboard
          </h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
          />
          <select className="w-full sm:w-48 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white text-gray-700">
            <option value="all">All Accounts</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        {pendingDriverApplications.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">
              No pending applications found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Username</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Driver Status</th>
                    <th className="py-4 px-6">License Number</th>
                    <th className="py-4 px-6">Experience</th>
                    <th className="py-4 px-6">License Photo</th>
                    <th className="py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingDriverApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-gray-900">
                        {application.user?.userName ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.user?.email ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {typeof application.user?.role === "object"
                          ? application.user.role?.roleName ?? "N/A"
                          : application.user?.role ?? "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            application.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : application.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {application.status ?? "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.licenseNumber ?? "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {application.experience ?? "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        {application.driversLicensePhoto && (
                          <img
                            src={`http://localhost:3030${application.driversLicensePhoto}`}
                            alt="Driver License"
                            className="h-12 w-12 object-cover rounded-md border border-gray-200"
                            onError={(e) =>
                              (e.currentTarget.src = "/fallback-image.png")
                            }
                          />
                        )}
                      </td>
                      <td className="py-4 px-6 flex gap-2">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                dispatch(
                                  ApproveDriverApplication({
                                    userId:
                                      application.user?._id || application._id,
                                    status: "approved",
                                  })
                                )
                              }
                              className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-all duration-200 disabled:opacity-50 text-sm font-medium"
                              disabled={isLoading}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                dispatch(
                                  ApproveDriverApplication({
                                    userId: application.user?._id,
                                    status: "rejected",
                                  })
                                )
                              }
                              className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-all duration-200 disabled:opacity-50 text-sm font-medium"
                              disabled={isLoading}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-gray-600">
          <button
            disabled={true}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page 1 of 1</span>
          <button
            disabled={true}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
