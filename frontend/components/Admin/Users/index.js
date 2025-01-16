"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2Icon } from "lucide-react";
import formatNumberToCurrency from "../../../utils/numberToMoney";
import StatusComponent from "../../../components/Status";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import categoryName from "../../../constants/CategoryNames";

const AdminUsersListComponent = (props) => { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Fetch users from the backend
  useEffect(()=>{
    const getUsers = async (page = 1) => {
      setLoading(true);
      try {
        const response = await requestHandler.get(
          `${props.endpoint}?page=${page}&limit=20`,
          true
        );
  
        if (response.statusCode === 200) {
          const result = response.result.data;
          setUsers(result.users);
          setTotalPages(result.totalPages);
          //localStorage.setItem("my_users", JSON.stringify(result.users));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers()
  },[])

  // Handlers
  const handleView = (userId) => {
    toast.success("Please wait...");
    router.push(`/admin/users/view/${userId}`, undefined, { shallow: true });
  };

  const handleEdit = (userId) => {
    toast.success("Please wait...");
    router.push(`/admin/users/edit/${userId}`, undefined, { shallow: true });
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await requestHandler.deleteReq(
          `${endpointsPath.userAdmin}/${userId}`,
          true
        );

        if (response.statusCode === 200) {
          toast.success(response.result.message || "User deleted successfully");
          const filteredUsers = users.filter((user) => user._id !== userId);
          setUsers(filteredUsers);
          //localStorage.setItem("my_users", JSON.stringify(filteredUsers));
        } else {
          toast.error(response.result.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error("Error deleting user");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:py-20">
      <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 text-start px-4 border-b">Full Name</th>
                <th className="py-2 text-start px-4 border-b">Shop Name</th>
                <th className="py-2 text-start px-4 border-b">Verified</th>
                <th className="py-2 text-start px-4 border-b">Blocked</th>
                <th className="py-2 text-start px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No user found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.first_name} {user.last_name}</td>
                    <td className="py-2 px-4 border-b">
                      {user?.shop_name}
                    </td>
                    <td className="py-2 px-4 border-b">{user?.is_user_verified? 'Verifed' : ''}</td>
                    <td className="py-2 px-4 border-b">{user?.is_account_blocked? 'Blocked' : ''}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <button
                          onClick={() => handleView(user._id)}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="w-full bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="w-full flex bg-red-500 text-white justify-center px-4 py-2 rounded hover:bg-red-700"
                        >
                          <Trash2Icon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersListComponent;
