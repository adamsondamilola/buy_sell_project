'use client';
import { Button, Dropdown, Modal } from "flowbite-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../utils/loader";
import requestHandler from "../../../utils/requestHandler";

export default function CallReportBtn(props) {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userData, setUserData] = useState([])
  const emailInputRef = useRef<HTMLInputElement>(null);

  const reportReasons = [
    "Fraud", 
    "Misrepresentation", 
    "Poor_Service", 
    "Non_Delivery", 
    "Damaged_Goods", 
    "Violation_of_Policies", 
    "Scam_Attempts", 
    "Inappropriate_Content", 
    "Health_and_Safety_Concerns", 
    "Privacy_Violations", 
    "Intellectual_Property_Violations", 
    "Unauthorized_Reselling", 
    "Multiple_Complaints", 
    "Price_Gouging"
  ];

  const getLoggedInUser = async () => {
    let resp = await requestHandler.get('user', true);
    let token = localStorage.getItem('token');
    if(token != null && resp != null && resp.requestSuccessful == true){
        setUserData(resp.responseBody)
        setIsUserLoggedIn(true)
        return true
    }
    return false
  }

  const handleWhatsAppCall = (num) => {
    if(num != null && num != ''){
      if(num[0] == "+") num.replace('+', '');
      location.href=`https://wa.me/${num}`
    }else {
      toast.error('failed, please try again')
    }
  }

  const handleDirectCall = (num) => {
    if(num != null && num != ''){
      location.href=`tel:${num}`
    }
    else {
      toast.error('failed, please try again')
    }
  }

  const handleCallBackRequest = async () => {
    setIsLoading(true)
    let isUser = await getLoggedInUser();
    if(!isUser){
      toast.error('You must be logged in to send request.')
    }
    else{
      toast.success('Request sent!')
    }
    setIsLoading(false)
  }


  const handleReport = async () => {
    setIsLoading(true)
    let isUser = await getLoggedInUser();
    if(!isUser){
toast.error('You must be logged in to send a report')
setIsLoading(false)
    }
    else {
      const data = {
        //"reportedSellerEmail": props.email,
        "reportedSellerUserId": props.sellerId,
        "reportReason": reason,
        "reportDescription": report
      }
  
    try {
      const response = await fetch(`${process.env.baseUrl}report`, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${requestHandler.getToken()}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const result = await response.json();
        toast.error(result['errors'][0] || result.responseMessage || 'Error sending report, please try again');
        setIsLoading(false)
      } else {
        toast.success('Report sent successfully');
        setIsLoading(false)
        setOpenModal(false);
      }
    } catch (error) {
      console.log('Error:', error);
      setIsLoading(false)
      toast.error('An error occurred, please try again');
    }
  
    }
  }

  return (
    <div className="mt-4 flex space-x-3 lg:mt-6">
          <Dropdown className="" theme={{floating: { target: "w-full" } }} label="Contact Seller">
          <Dropdown.Item onClick={()=>handleDirectCall(props.phone)} >Phone</Dropdown.Item>
          {/*<Dropdown.Item>Chat</Dropdown.Item>*/}
          <Dropdown.Item onClick={()=>handleWhatsAppCall(props.whatsapp)}>WhatsApp</Dropdown.Item>
          <Dropdown.Item onClick={()=>handleCallBackRequest()}>{isLoading? 'please wait...' : 'Request callback'}</Dropdown.Item>
          {/*<Dropdown.Item>In-app call</Dropdown.Item>*/}
          </Dropdown>
          <a
          onClick={() => setOpenModal(true)}
            href="#"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Report
          </a>

          <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Report {props.shopName}</h3>
            {/*<div>
              <div className="mb-2 block">
                <label>Email</label>
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
               onChange={(e) => setReason(e.target.value)}
               >
                <option>Select</option>
                {
                  reportReasons.map((x) => {
                    return(
                      <option key={x} value={x}>
                          {x.replaceAll('_', ' ')}
                      </option>
                    )
                  })
                }
              </select>
            </div>
            <div>
            <div className="mb-2 block">
                <label>Make a report</label>
              </div>
              <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded" required>

              </textarea>
            </div>
            <div className="w-full">
               {isLoading? <LoadingSpinner loading={isLoading}/> : <Button onClick={handleReport}>Send Report</Button> }
            </div>
          </div>
        </Modal.Body>
      </Modal>

        </div>
  );
}
