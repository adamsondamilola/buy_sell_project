"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import formatNumberToCurrency from "../../../utils/numberToMoney";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import { Api, ChevronRight, Circle, Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { Button, Card, Dropdown, Modal } from "flowbite-react";
import { truncateText } from "../../../utils/truncateText";
import AppImages from "../../../constants/Images";
import { formatImagePath } from "../../../utils/formatImagePath";
import { useRouter } from "next/navigation";
import categoryName from "../../../constants/CategoryNames";
import Image from "next/image";
import Link from "next/link";
import RatingStars from "../../RatingStars";
import dateTimeToWord from "../../../utils/dateTimeToWord";
import Spinner from "../../../utils/loader";
import LoginRedirectComponent from "../../Auth/LoginRedirect";

const PosterShortDetailsCardComponent = (props) => {
  const [favorites, setFavorites] = useState({});
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openModalTips, setOpenModalTips] = useState(false);
  const [hasOtherReason, setHasOtherReason] = useState(false);
  const [reason, setReason] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [url_, setUrl] = useState(null)
  const emailInputRef = useRef<HTMLInputElement>(null);

  const reportReasons = [
    "Fraud", 
    "Misrepresentation", 
    "Poor Service", 
    "Non Delivery", 
    "Damaged Goods", 
    "Inappropriate Content", 
    "Intellectual Property Violations", 
    "Unauthorized Reselling", 
    "Other Reason"
  ];

  const safetyTips = [
    "Use the platform messaging system for documentation of conversations.", 
    "Watch out for overly generous offers or requests for unusual meeting locations.", 
    "If something feels off, it is better to walk away.", 
    "Take pictures of the product at the time of purchase for your records.", 
    "Discuss pricing and payment terms clearly before meeting.", 
    "Arrange to meet the seller in a public place to inspect the item before purchasing.", 
    "Check the seller's profile, reviews, and ratings on the platform.", 
    "Its advisable never to send money in advance to secure a product.", 
    "Avoid deals that seem too good to be true."
  ];

   // Toggle favorite status for a product
   const toggleFavorite = async (productId) => {
    //add favorite
    const payload = {
        product_id: productId
    }
    const req = await requestHandler.post(`${endpointsPath.userFavorite}/create`,payload, true);
    if(req.statusCode === 400){
        //toast.error(req.result.message)
        if(req.result.message === 'Already added to favorite'){
            const del = await requestHandler.deleteReq(`${endpointsPath.userFavorite}/${productId}`, true);
        }
    }
    if(req.statusCode === 401){
        toast.error('You must be logged in to add favorite')
    }
    else {
        setFavorites((prev) => ({
            ...prev,
            [productId]: !prev[productId],
          }));
    }
    
  };

    const handleReport = async () => {
      setIsLoading(true)
      
        const data = {
          "seller_id": props.userId,
          "subject": reason,
          "message": report
        }
    
      try {
        const response = await requestHandler.post(`${endpointsPath.user}/report/create`, data, true);
        if(reason === null || reason == ''){
          toast.error("Select or enter reason")
        }
        else if (response.result.message === 'You are not logged in') {
          LoginRedirectComponent(`/page/${props.username}`)
        }
        else if (response.statusCode != 200) {
          toast.error(response.result.message || 'Error sending report, please try again');
          setIsLoading(false)
        } else {
          toast.success('Report sent successfully');
          setIsLoading(false)
          setOpenModal(false);
          setHasOtherReason(false)
          setReason('')
          setReport('')
        }
      } catch (error) {
        console.log('Error:', error);
        setIsLoading(false)
        toast.error('An error occurred, please try again');
      }
      finally{
        setIsLoading(false)
      }
    }

  // Handlers
  const handleGetInTouch = () => {
    //alert(url_)
    window.open(url_);
  };

  const setUrlHandler = (url) => {
    setUrl(url)
    setOpenModalTips(true)
  }


  return (
<Card className="">
      <div className="flex justify-end px-4 pt-4">
      <div onClick={()=>setOpenModal(true)}
              className="block text-sm text-red-600 hover:text-purple-950 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Report
            </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <Image
          alt="Bonnie image"
          height="96"
          src={props.picture || AppImages.avatar}
          width="96"
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            <Link href={`/page/${props.username}`}>
            {props.shop_name}
            </Link>
            </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">Joined: {dateTimeToWord(props.createdAt)} </span>
        <RatingStars score={props.rating ?? 1}/>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <div onClick={()=>setUrlHandler(`tel:${props.phone}`)}
            className="inline-flex items-center rounded-lg bg-purple-950 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            Call
          </div>
          <div onClick={()=>setUrlHandler(`https://wa.me/${props.whatsapp}`)}
            target="_blank"
            className="inline-flex items-center rounded-lg bg-green-700 px-2 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            WhatsApp
          </div>
        </div>
      </div>

      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Report {props.shop_name}</h3>
            {/*<div>
              <div className="mb-2 block">
                <label>Your Email</label>
              </div>
              <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
            </div>*/}
            <div>
              <div className="mb-2 block">
                <label>Reason</label>
              </div>
              <select 
              className="w-full p-2 mb-4 border border-gray-300 rounded"
               onChange={(e) =>{e.target.value == "Other Reason"? setHasOtherReason(true) : setHasOtherReason(false); setReason(e.target.value)}}
               >
                <option>Select</option>
                {
                  reportReasons.map((x) => {
                    return(
                      <option key={x} value={x == "Other Reason"? null : x}>
                          {x.replaceAll('_', ' ')}
                      </option>
                    )
                  })
                }
              </select>
              {
                hasOtherReason?
                <input 
              className="w-full p-2 mb-4 border border-gray-300 rounded"
               onChange={(e) => setReason(e.target.value)} 
               placeholder="Enter reason"
               />
               : ''
              }
            </div>
            <div>
            <div className="mb-2 block">
                <label>Make a report</label>
              </div>
              <textarea
              placeholder="Enter"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded" required>

              </textarea>
            </div>
            <div className="w-full">
               {isLoading? <Spinner loading={isLoading}/> : <Button color="purple" onClick={handleReport}>Send Report</Button> }
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModalTips} size="md" popup onClose={() => setOpenModalTips(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Before you contact {props.shop_name}, below are some safety tips</h3>
            <div>
              <div className="mb-2 block">
              {safetyTips.map((x, index) => {
                    return(
                      <div className="mb-2" key={x} value={x}>
                          <Circle className="text-sm"/> {x}
                      </div>
                    )
                  })}
              </div>
            </div>
            <div className="w-full">
               <Button color="purple" onClick={handleGetInTouch}>Proceed</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </Card>
  );
};

export default PosterShortDetailsCardComponent;
