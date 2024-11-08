import React, { useEffect, useState } from "react";
// import { fetchUser } from "../../Redux/Users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchUser } from "../../Redux/Users/userSlice";
const ManagerUsers = () => {
    const { isLoading, Users, error } = useSelector((state) => state.Users);
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchUser());
    }, []);
    const [user, setUsers] = useState(Users);
    // console.log(Users);
    useEffect(() => {
        setUsers(Users);
      }, [Users]);
      const handleMakeAdmin = (user) => {
        // console.log(user);
        fetch(`${import.meta.env.VITE_LOCALHOST_KEY}/users/admin/${user?._id}`, {
          method: "PATCH",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount) {
              // Updating the user in the local state
              toast(`${user?.name} is now Admin !!`);
              const updatedUsers = Users.map((u) => {
                if (u._id === user._id) {
                  return { ...u, role: "admin" };
                }
                return u;
              });
              setUsers(updatedUsers);
            }
          });
      };
  return (
    <section className="px-5 pt-7">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="text-left">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Name
            </th>

            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Email
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Role
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Action
            </th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {user?.map((User) => (
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {User.name}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {User?.email}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {User?.role ? User?.role : "User"}
              </td>

              <td className="whitespace-nowrap px-4 py-2">
                <div className="flex gap-2">
                  <span
                    onClick={() => handleMakeAdmin(User)}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-200 hover:bg-cyan-400 hover:text-gray-600 transition-colors duration-500 px-2 py-1 text-xs font-semibold  text-cyan-600"
                  >
                    {User.role === "admin" ? "admin" : <>Make Admin</>}
                  </span>
                  {User.role === "admin" ? (
                    <span
                      onClick={() => handleMakeAdmin(User)}
                      className="inline-flex items-center gap-1 rounded-full bg-cyan-200 hover:bg-cyan-400 hover:text-gray-600 transition-colors duration-500 px-2 py-1 text-xs font-semibold  text-cyan-600"
                    >
                      {User.role === "admin" ? <>Make User</> : ""}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
  )
}

export default ManagerUsers