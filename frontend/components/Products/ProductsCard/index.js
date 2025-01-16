"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import formatNumberToCurrency from "../../../utils/numberToMoney";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { Card } from "flowbite-react";
import { truncateText } from "../../../utils/truncateText";
import AppImages from "../../../constants/Images";
import { formatImagePath } from "../../../utils/formatImagePath";
import { useRouter } from "next/navigation";
import categoryName from "../../../constants/CategoryNames";
import { MapPin } from "lucide-react";

const ProductsCardComponent = (props) => {
  const [favorites, setFavorites] = useState({});
  const router = useRouter();

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
          const confirm = window.confirm("Already added to Favorite. Click Ok to remove")
          if(confirm){
            const del = await requestHandler.deleteReq(`${endpointsPath.userFavorite}/${productId}`, true);    
          }
        }
    }
    else if(req.statusCode === 401){
        toast.error('You must be logged in to add favorite')
    }
    else {
        setFavorites((prev) => ({
            ...prev,
            [productId]: !prev[productId],
          }));
    }
    
  };

  // Handlers
  const handleView = (productId, category, slug) => {
    toast.success("Please wait...");
    if(category === categoryName.vehicles) router.push(`/products/vehicle/${productId}/${slug}`, undefined, { shallow: true });
    else if(category === categoryName.motorcyclesTricycles) router.push(`/products/motorcycle-and-tricyle/${productId}/${slug}`, undefined, { shallow: true });
    else router.push(`/products/${productId}/${slug}`, undefined, { shallow: true });
  };


  return (
    <Card key={props._id}>
  <div className="relative h-42 bg-gray-300 flex rounded-lg shadow-md">
  <img
  onClick={() => handleView(props._id, props.category, props.slug)}
  src={formatImagePath(props.image) || AppImages.loading}
  alt={props.title}
  className={props.title? "h-32 w-full object-cover rounded-lg" : "object-cover rounded-lg"}
  />
  <div onClick={()=>toggleFavorite(props._id)} className="absolute top-2 right-2 bg-gray-100 text-red-500 rounded-full shadow-md w-8 h-8 flex items-center justify-center"> 
  {favorites[props._id] || props.fav? <Favorite/> : <FavoriteBorderOutlined/>}
  </div>
  </div>
  <div onClick={() => handleView(props._id, props.category, props.slug)} className="grid grid-cols-1, gap-0">
  <div className="text-gray-500 space-y-10">{truncateText(props.title || "", 20)}</div>
  <div className="font-bold">{formatNumberToCurrency(props.price)}</div>
  <div className="text-gray-500 space-y-10 text-xs flex"><MapPin size={13}/> {props.city}, {props.state}</div>
  {/*<div className="text-gray-500">{<RatingStars score={5}/>}</div>*/}
  </div>
</Card>
  );
};

export default ProductsCardComponent;
