import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchUser } from "../../Redux/Users/userSlice";
import {
  FiUsers,
  FiShield,
  FiSearch,
  FiCheckCircle,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const ManagerUsers = () => {
  const { Users = [], isLoading } = useSelector((state) => state.Users || {});
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleMakeAdmin = (targetUser) => {
    fetch(`${import.meta.env.VITE_LOCALHOST_KEY}/users/admin/${targetUser?._id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          toast.success(`${targetUser?.name} is now an Admin!`);
          dispatch(fetchUser());
        }
      })
      .catch(() => toast.error("Failed to update user role"));
  };

  const filteredUsers = (Users || []).filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u?.name?.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q) ||
      u?.role?.toLowerCase().includes(q)
    );
  });

  const adminCount = (Users || []).filter((u) => u?.role === "admin").length;
  const customerCount = (Users || []).length - adminCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <FiShield className="w-3.5 h-3.5" />
              Role-Based Access
            </span>
            <span className="text-xs text-slate-400">
              {Users.length} Registered Accounts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage administrative privileges, inspect customer registrations, and configure permissions.
          </p>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Registered Users</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {Users.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Administrators</p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {adminCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <FiShield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111622] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Shoppers / Customers</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">
              {customerCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#111622] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredUsers.map((u) => {
                const isAdmin = u?.role === "admin";
                return (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                          {u?.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {u?.name || "Customer Account"}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            ID: {u._id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {u?.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isAdmin
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isAdmin ? (
                          <>
                            <FiShield className="w-3 h-3 text-amber-500" />
                            Administrator
                          </>
                        ) : (
                          "Customer"
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleMakeAdmin(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isAdmin
                            ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                        }`}
                      >
                        {isAdmin ? "Revoke Admin" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerUsers;