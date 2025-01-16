"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import { formatImagePath } from "../../../utils/formatImagePath";
import { FaCheckCircle } from "react-icons/fa"; // Import check icon from react-icons
import { Copy } from "lucide-react";
import { truncateText } from "../../../utils/truncateText";
import LoginRedirectComponent from "../../Auth/LoginRedirect";
import { Delete, DeleteForever, Logout } from "@mui/icons-material";
import AppImages from "../../../constants/Images";
import { Button } from "flowbite-react";

const ViewProfileComponent = (props) => {
  const id = props.id;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); // State to track clipboard copy status

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await requestHandler.get(`${endpointsPath.profile}`, true);
        if (response.statusCode === 200) {
          setUser(response.result.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    LoginRedirectComponent('/user/profile');
    fetchUser();
  }, [id]);

  const handleShareUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(`${process.env.website}/page/${user.username}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied status after 2 seconds
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>User not found.</p>
        {/*<button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700 font-semibold mt-4"
        >
          &larr; Go Back
        </button>*/}
      </div>
    );
  }

  const logOut = () => {
    localStorage.removeItem('token')
    router.push("/")
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center flex-col">
          <img
            src={formatImagePath(user.picture) || AppImages.avatar}
            alt={`${user.first_name}'s profile`}
            className="w-24 h-24 rounded-full mb-4 shadow-md"
          />
          <h2 className="text-xl font-semibold flex items-center">
            {user.first_name} {user.last_name}
            {user?.is_user_verified && (
              <FaCheckCircle
                className="text-blue-500 ml-2"
                title="Verified User"
              />
            )}
          </h2>
          {user.role=="Seller"? <div className="flex flex-wrap justify-center items-center">
          <p className="text-gray-600">{`${truncateText(process.env.website, 10)}/page/${user.username}`}</p>
          <button
            onClick={handleShareUsername}
            className="ml-2 text-purple-950 text-sm hover:text-blue-700 font-semibold"
          >
            <Copy/>
          </button>
          </div> : ""}
          {copied && <p className="text-green-500 text-sm mt-1">Link copied!</p>}
        </div>
      </div>

      {/* Shop Details Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Business Details</h3>
        <p>
          <strong>Name:</strong> {user.shop_name}
        </p>
        <p>
          <strong>Address:</strong> {user.shop_address}
        </p>
        <p>
          <strong>Description:</strong> {user.shop_description}
        </p>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>WhatsApp:</strong> {user.whatsapp}
        </p>
      </div>

      {/* Location Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <p>
          <strong>City:</strong> {user.city}
        </p>
        <p>
          <strong>State:</strong> {user.state}
        </p>
        <p>
          <strong>Country:</strong> {user.country}
        </p>
      </div>

<div className="flex justify-between items-center">
      {/* Delete Button */} 
      <div className="text-center">
        <Button
          onClick={() => alert("Your account will be deleted if you are not active for 90 days.")}
          className="bg-red-500 hover:bg-purple-950 font-semibold"
        >
          <DeleteForever className="text-lg"/> <span className="">Delete Account</span>
        </Button>
      </div>

      {/* Back Button */} 
      <div className="text-center">
        <button
          onClick={() => logOut()}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          <Logout/> Log Out
        </button>
      </div>
      </div>

    </div>
  );
};

export default ViewProfileComponent;
