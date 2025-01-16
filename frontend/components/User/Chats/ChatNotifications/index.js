import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import requestHandler from '../../../../utils/requestHandler';
import endpointsPath from '../../../../constants/EndpointsPath';
import { formatImagePath } from '../../../../utils/formatImagePath';
import AppImages from '../../../../constants/Images';
import { truncateText } from '../../../../utils/truncateText';
import moment from 'moment';
import LoginRedirectComponent from '../../../Auth/LoginRedirect';

const ChatNotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const getNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const response = await requestHandler.get(
        `${endpointsPath.user}/notification/chat/list?page=${page}&limit=20`,
        true
      );

      if (response.statusCode === 200) {
        const result = response.result.data;
        setNotifications(result.chatNotifications);
        setUserId(result.userId)
        setTotalPages(Math.ceil(result.total / 20)); // Calculate total pages
        localStorage.setItem('my_chat_notifications', JSON.stringify(result.chatNotifications));
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewNotification = async (id, chat_user_id, hasRead) => {
    setLoading(true);
    const url = `/chat/${chat_user_id}`
    try {
        if(hasRead === true){
            router.push(url)
        }
        else if(chat_user_id == userId){
            router.push(url)
        }
        else{

        
      const response = await requestHandler.get(
        `${endpointsPath.user}/notification/${id}/read`,
        true
      );

      if (response.statusCode === 200) {
        //redirect
        router.push(url)
      }
    }
    } catch (error) {
      console.error('Error fetching notification:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedNotifications = localStorage.getItem('my_chat_notifications');
    if (cachedNotifications) {
      setNotifications(JSON.parse(cachedNotifications));
    }
    getNotifications(currentPage); // Fetch fresh data
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(()=>{
LoginRedirectComponent('/chat')
  },[])

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-3xl mx-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li onClick={()=>viewNotification(notification._id,
                userId != notification.user_id._id? notification.user_id._id : notification.sender_id._id,
              notification.is_read)} key={notification._id} className={"flex items-center py-2"}>
                {/* User Picture */}
                <img
                  src={formatImagePath(userId == notification.user_id._id?  (notification.sender_id.picture != null? notification.sender_id.picture : AppImages.avatar) : (notification.user_id?.picture != null? notification.user_id?.picture : AppImages.avatar))}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  {/* Sender Details */}
                  <h3 className="font-semibold text-gray-800">
                    {userId == notification.user_id._id? notification.sender_id.first_name : notification.user_id.first_name || 'Unknown Sender'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.sender_id.Shop_name || ''}
                  </p>
                  {/* Notification Message */}
                  <p className={userId == notification.user_id._id && !notification.is_read? "text-sm font-bold text-purple-950 mt-1" : "text-sm text-gray-700 mt-1"}>{truncateText(notification.message, 15)}</p>
                </div>
                {/* Notification Time */}
                <span className={userId == notification.user_id._id && !notification.is_read? "text-sm font-bold text-purple-950" : "text-sm text-gray-400"}>
                  {moment(notification.createdAt).format('MMM D')}
                </span>
              </li>
            ))
          ) : (
            <li className="py-4 text-center text-gray-500">No chats available.</li>
          )}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatNotificationsList;