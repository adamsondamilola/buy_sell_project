"use client"

import { useEffect, useState } from "react";
import requestHandler from "../../../utils/requestHandler";
import endpointsPath from "../../../constants/EndpointsPath";
import { useRouter } from "next/navigation";
import { Add, PlusOneOutlined, ProductionQuantityLimitsSharp, Work, WorkHistory } from "@mui/icons-material";
import Link from "next/link";
import { CarFront, Home } from "lucide-react";
import LoginRedirectComponent from "../../Auth/LoginRedirect";

const SellComponent = () => {
    const [addedShop, setAddedShop] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [isSellerChecked, setIsSellerChecked] = useState(false);
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/sell/register', undefined, {shallow: true})
  }

  const handleVerification = () =>{
    router.push('/sell/verify/info', undefined, {shallow: true})
  }

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      try {
        const resp = await requestHandler.get(endpointsPath.profile, true);
        if (resp.statusCode === 200) {
          const result = resp.result.data.user;
          if (result.role === 'Seller') {
            setIsSeller(true);
          }
          if(result.shop_name){
            setAddedShop(true)
          }else{
            setAddedShop(false)
          }
        }
      } catch (error) {
        console.log("Error checking user role:", error);
      } finally {
        setLoading(false);
        setIsSellerChecked(true);
      }
    };
    LoginRedirectComponent('/sell');
    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const req = await requestHandler.get(endpointsPath.verificationFiles, true);
        if (req.statusCode === 200) {
          let docs = req.result.data.docs;
          setUploadedFiles(docs);
        }
      } catch (error) {
        console.log("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div>Loading...</div>
      </div>
    );
  }

  if (!loading && !addedShop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col">
        <div>You need to add your business information and get verified to start posting products and services</div>
        <div className="text-center">
          <button onClick={handleGetStarted} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Get Started
          </button>
        </div>
        </div>
      </div>
    );
  }

  if (!loading && !uploadedFiles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col">
        <div>You need to get verified to start posting products and services</div>
        <div className="text-center">
          <button onClick={handleVerification} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Start Verification
          </button>
        </div>
        </div>
      </div>
    );
  }

  if (uploadedFiles && isSellerChecked && !isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div>We are reviewing your documents for verification</div>
      </div>
    );
  }

  if (isSeller) {
    return (
      <div>
        <p className="mt-5 p-4 text-2xl text-gray-400 dark:text-gray-500">Make a new post</p>
        <div className="grid grid-cols-1 w-full gap-4 mb-4">
    <div className="flex items-center justify-center h-24 rounded bg-purple-500 text-white hover:bg-purple-950 dark:text-gray-50 dark:bg-gray-800">
    <Link shallow href={'/sell/new'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-2xl dark:text-gray-500">
          <ProductionQuantityLimitsSharp/>
       </p>
       <p className="p-4 text-2xl dark:text-gray-500">
          Product
       </p>
       <p className="p-4 text-2xl dark:text-gray-500">
          <Add/>
       </p>
       </div>
       </Link>
    </div>
    </div>
      </div>
    );
  }

  return null;
};

export default SellComponent;
