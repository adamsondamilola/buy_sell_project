"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import requestHandler from "../../utils/requestHandler";
import { formatImagePath } from "../../utils/formatImagePath";
import { FaCheckCircle } from "react-icons/fa"; // Import check icon from react-icons
import { Copy } from "lucide-react";
import { truncateText } from "../../utils/truncateText";
import endpointsPath from "../../constants/EndpointsPath";
import PosterShortDetailsCardComponent from "../User/PosterShortDetailsCard";
import Link from "next/link";
import RatingStars from "../RatingStars";
import { Button, Card, Modal } from "flowbite-react";
import { Star } from "@mui/icons-material";
import Spinner from "../../utils/loader";
import { toast } from "react-toastify";
import LoginRedirectComponent from "../Auth/LoginRedirect";
import ProductsByUsernameComponent from "../Products/ProductsByUsername";
import PropertiesByUsernameComponent from "../Properties/PropertiesByUsername";

const PageComponent = (props) => {
  const id = props.id;
  const router = useRouter();
   const params = useParams();
   const [user, setUser] = useState(null);
   const [review, setReview] = useState(null);
   const [star, setStar] = useState(0);
   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); // State to track clipboard copy status
  const [openModal, setOpenModal] = useState(false);

  const getReviews = async () => {
    setLoading(true);
    try {
      const response = await requestHandler.get(`${endpointsPath.sellerReview}/${user._id}?page=1&limit=20`, false);
      if (response.statusCode === 200) {
        setReviews(response.result.data.reviews);
      } else {
        
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await requestHandler.get(`${endpointsPath.profile}/${params.username}`, false);
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
    fetchUser();
  }, [id]);

  useEffect(() => {
    getReviews();
  }, [user]);

  const handleReview = async () => {
    setLoading(true)
    
      const data = {
        "seller_id": user._id,
        "star": star,
        "review": review
      }
  
    try {
      const response = await requestHandler.post(`${endpointsPath.user}/review/create`, data, true);
  
      if (response.result.message === 'You are not logged in') {
        LoginRedirectComponent(`/page/${user.username}`)
      }
      else if (response.statusCode != 200) {
        toast.error(response.result.message || 'Error sending review, please try again');
        setLoading(false)
      } else {
        getReviews();
        toast.success(response.result.message);
        setLoading(false)
        setOpenModal(false);
      }
    } catch (error) {
      console.log('Error:', error);
      setLoading(false)
      toast.error('An error occurred, please try again');
    }
    finally{
      setLoading(false)
    }
  }

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
        <p>...</p>
        {/*<button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700 font-semibold mt-4"
        >
          &larr; Go Back
        </button>*/}
      </div>
    );
  }


  return (
    <div className="container mx-auto py-4">

        {/* Poster/Seller Details */}
        <PosterShortDetailsCardComponent 
          picture={formatImagePath(user?.picture)} 
          shop_name={user?.shop_name}
          rating={user?.rating}
          createdAt={user?.createdAt}
          userId={user?._id}
          username={user?.username}
          phone={user?.phone}
          whatsapp={user?.whatsapp?.substring(1)}
          />

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 mb-6">
        <div className="flex items-center flex-col">
          <h2 className="text-xl font-semibold flex items-center">
            {/*`${user.first_name} ${user.last_name}`*/}
            {user?.is_user_verified && (
                <div className="flex">
                    Verified
              <FaCheckCircle
                className="text-blue-500 ml-2"
                title="Verified User"
                size={25}
              />
              </div>
            )}
            {!user?.is_user_verified && (
                <div className="text-red-500 flex">
                   Not Verified
              </div>
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

      {/* Contact Information Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p>
        {user.shop_description}
        </p>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/* Location Card */}
<div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <p>
             {user.city}, {user.state}, <br/>{user.country}
        </p>
      </div>

      {/* Shop Details Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        <p>
          {user.shop_address}
        </p>
      </div>
      </div>

      {/* Reviews */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="items-center text-lg font-semibold mb-4">Reviews <RatingStars score={user.rating} /></h3>
        <div className="">
                   {
  loading? <Spinner loading={loading} />
  :
<div>
  {reviews.length < 1? <p>No Reviews!</p> :
  reviews.map((x) => {
    return (
      <div key={x}>
        <b className='text-sm'>{x.user_id.first_name} {x.user_id.last_name}</b> <RatingStars score={x.star}/>
        <p className='mb-4'>{x.review}</p>
        </div>
    )
  })
  }
</div>
}
        <br/>
                    <Button color="purple" onClick={() => setOpenModal(true)}>Add Review</Button>
        
                </div>
      </div>
      
      {/*Review modal*/}
      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="font-medium text-gray-900 dark:text-white">Rate {user.shop_name}</h3>
            <div>
              <div className="mb-2 block">
                <label>Select Rating</label>
              </div>
              <div className='flex'>
              <Star className={star > 0? "text-yellow-300" : "text-gray-200"} onClick={() => setStar(1)}/>
              <Star className={star > 1? "text-yellow-300" : "text-gray-200"} onClick={() => setStar(2)}/>
              <Star className={star > 2? "text-yellow-300" : "text-gray-200"} onClick={() => setStar(3)}/>
              <Star className={star > 3? "text-yellow-300" : "text-gray-200"} onClick={() => setStar(4)}/>
              <Star className={star > 4? "text-yellow-300" : "text-gray-200"} onClick={() => setStar(5)}/>
              </div>
            </div>
            <div className='flex flex-col' style={{display: star > 0? 'flex' : 'none'}}>
            <div className="mb-2 block">
                <label>Write a review</label>
              </div>
              <textarea
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded" required>

              </textarea>
            
            <div className="w-full">
            {
  loading? <Spinner loading={loading} />
  :
  <Button onClick={handleReview} >Post Review</Button>
}
              
            </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default PageComponent;