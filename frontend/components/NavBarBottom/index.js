"use client"
import { Calculate, Campaign, CampaignOutlined, Chat, ChatOutlined, Favorite, FavoriteBorderOutlined, FavoriteOutlined, Home, HomeOutlined, NotificationAddOutlined, Notifications, NotificationsOutlined, Person, PersonOutline } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import endpointsPath from "../../constants/EndpointsPath";
import requestHandler from "../../utils/requestHandler";

const BottomNav = () => {
    const [currentUrl, setCurrentUrl] = useState(null)
    const [notifications, setNotifications] = useState([]);
    useEffect(()=>{
      const getNotifications = async (page = 1) => {
        try {
          const response = await requestHandler.get(
            `${endpointsPath.user}/notification/chat/pending?page=${page}&limit=20`,
            true
          );
    
          if (response.statusCode === 200) {
            const result = response.result.data;
            setNotifications(result.chatNotifications);
            localStorage.setItem('my_chat_notifications', JSON.stringify(result.chatNotifications));
          }
        } catch (error) {
          console.log('Error fetching notification:', error);
        }
      };
      getNotifications();
    },[])

    const notiCalc = (num) =>{
      try {
        if(parseInt(num) > 9) return "9+"
        else return num;
      } catch (error) {
        return "0";
      }
    }
    
  return (
    <nav className="lg:hidden md:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200">
      <div className="flex justify-around p-2">
        <Link onClick={()=>setCurrentUrl("/")} href="/" className="flex flex-col items-center text-purple-950  hover:text-blue-500">
        {currentUrl=='/'? <Home/> : <HomeOutlined/>}
            <span className="text-sm">Home</span>
        </Link>
        <Link onClick={()=>setCurrentUrl("/favorites")} href="/favorites" className="flex flex-col items-center text-purple-950  hover:text-blue-500">
        {currentUrl=='/favorites'? <Favorite/> : <FavoriteBorderOutlined/>} 
            <span className="text-sm">Favourites</span>
        </Link>
        <Link onClick={()=>setCurrentUrl("/sell")} href="/sell" className="flex flex-col items-center text-purple-950  hover:text-blue-500">
        {currentUrl=='/sell'? <Campaign/> : <CampaignOutlined/>}
            <span className="text-sm">Sell</span>
        </Link>
        <Link onClick={()=>setCurrentUrl("/user/profile")} href="/user/profile" className="flex flex-col items-center text-purple-950  hover:text-blue-500">
        {currentUrl=='/user/profile'? <Person/> : <PersonOutline/>}
            <span className="text-sm">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
