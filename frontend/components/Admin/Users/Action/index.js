"use client"
import { useEffect, useState } from "react";
import endpointsPath from "../../../../constants/EndpointsPath";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button, Card, FloatingLabel, Spinner } from "flowbite-react";
import requestHandler from "../../../../utils/requestHandler";
import Link from "next/link";

const UserAdminActionsComponent = (props) => {
    const id = props.id
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Separate loading for actions
  
    const handleDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;
      setActionLoading(true);
      try {
        const response = await requestHandler.deleteReq(`${endpointsPath.userAdmin}/${id}`, true);
        if (response.statusCode === 200) {
          toast.success(response.result.message || "User deleted successfully");
          router.push("/admin/users");
        } else {
          toast.error(response.result.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error("Error deleting user");
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    };

    const handleBlock = async () => {
        const confirm = window.confirm("Are you sure you want to block this user?");
        if (!confirm) return;    
        setActionLoading(true);
        try {
          const response = await requestHandler.get(`${endpointsPath.userAdmin}/${id}/block`, true);
          if (response.statusCode === 200) {
            toast.success(response.result.message || "User blocked successfully");
            fetchUser();
          } else {
            toast.error(response.result.message || "Failed to block user");
          }
        } catch (error) {
          toast.error("Error blocking user");
          console.error(error);
        } finally {
          setActionLoading(false);
        }
      };

      const handleUnblock = async () => {
        const confirm = window.confirm("Are you sure you want to unblock this user?");
        if (!confirm) return;
    
        setActionLoading(true);
        try {
          let response = await requestHandler.patch(
            `${endpointsPath.userAdmin}/${id}`,
            { is_account_blocked: false },
            true
          );
          if (response.statusCode === 200) {
            toast.success("User unblocked successfully");
            fetchUser();
          } else {
            toast.error(response.result.message || "Failed to unblock user");
          }
        } catch (error) {
          toast.error("Error unblocking user");
          console.error(error);
        } finally {
          setActionLoading(false);
        }
      };
  
    const handleStatusUpdate = async (status) => {
      const statusMessages = {
        true: "approve",
        false: "reject"
      };
      const confirmAction = window.confirm(`Are you sure you want to ${statusMessages[status]} this user?`);
      if (!confirmAction) return;
  
      setActionLoading(true);
      try {
        let response = await requestHandler.patch(
          `${endpointsPath.userAdmin}/${id}`,
          { is_user_verified: status, role: 'Seller' },
          true
        );
        if(status === false){
          let response = await requestHandler.patch(
            `${endpointsPath.userAdmin}/${id}`,
            { is_user_verified: status, role: 'User' },
            true
          );
          //delete documents
          await requestHandler.deleteReq(`${endpointsPath.userAdmin}/${id}/docs`, true)
        }
        if (response.statusCode === 200) {
          toast.success(response.result.message || "Operation successful");
          fetchUser();
        } else {
          toast.error(response.result.message || "Operation failed");
        }
      } catch (error) {
        toast.error("Error performing operation");
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    };
  
    const [brand, setBrand] = useState('')
    const [updateBrand, setUpdateBrand] = useState(false)
    const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await requestHandler.get(`${endpointsPath.userAdmin}/${id}`, true);
          setUser(response.statusCode === 200 ? response.result.data.user : null);
        } catch (error) {
          console.log("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        if (id) fetchUser();
      }, [id]);

    return (
        <Card className="mt-5">
            <h4 className="text-xl font-semibold">Actions</h4>
            <div className="flex gap-4 mt-4">
             
              {!user?.is_user_verified ?
                <Button onClick={() => handleStatusUpdate(true)} color="green" disabled={actionLoading}>
                  {actionLoading ? <Spinner size="sm" /> : "Approve as Seller"}
                </Button>
                :
                <Button onClick={() => handleStatusUpdate(false)} color="red" disabled={actionLoading}>
                  {actionLoading ? <Spinner size="sm" /> : "Reject as Seller"}
                </Button>
              }
              {!user?.is_account_blocked ?
              <Button onClick={handleBlock} color="black" disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : "Block"}
              </Button>
              :
              <Button onClick={handleUnblock} color="purple" disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : "Un-Block"}
              </Button>
              }
              <Button onClick={handleDelete} color="red" disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : "Delete"}
              </Button>
              <Button onClick={()=>location.href='/admin/users/products/'+id} color="yellow" disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : "Products"}
              </Button>

            </div>

          </Card>
    );

}

export default UserAdminActionsComponent