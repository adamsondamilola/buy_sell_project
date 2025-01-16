import { useEffect, useState } from 'react';
import requestHandler from '../../utils/requestHandler';
import AppImages from '../../constants/Images';
import LoadingSpinner from '../../utils/loader';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';

export default function ProfileComponent() {
    const [userData, setUserData] = useState([])
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null)

    const handleUpdate = async (e) => {
        setHasError(false)
        setLoading(true)
        e.preventDefault();
        //let phone = "+19876543212";
        //let phone = "+"+phoneNumber;
        if(phoneNumber != null && phoneNumber[0] != "0"){
          //setPhoneNumber(phoneNumber.substring(1))
          //phone = "0"+phoneNumber
        }
        //alert(phoneNumber)
          try{
            const data = {
              firstName: firstName,
              lastName: lastName,
              gender: gender.toUpperCase(),
              phoneNumber: phoneNumber
            }

            //const formData = new FormData(); Object.keys(data).forEach(key => { formData.append(key, data[key]); });

            const  header = {
              //'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' +requestHandler.getToken()          
            }
            const postOptions = {
              method: 'PATCH',
              headers: header,
              body: JSON.stringify(data)
          };

          const resp = await fetch(process.env.baseUrl + 'user', postOptions);
            
            //let resp = await requestHandler.patch('user', (data), true);
            if(resp.ok){
              //alert(JSON.stringify(resp))
                  setLoading(false)
                  setHasError(false)
                  toast.success(resp.responseMessage)
                  setEditProfile(false)
            }
            else if(resp != null && resp.requestSuccessful == false){
              setHasError(true)
              let err = resp.responseMessage
              setResponseMessage(err)
              toast.error(err)
              setLoading(false)
            }
            else{
              setHasError(true)
              let err = resp["errors"][0]
              setResponseMessage(err)
              toast.error(err)
              setLoading(false)
            }
          }
          catch(e){
            setHasError(true)
            let err = "Internal server error"
            setResponseMessage(err)
            toast.error(err)
            setLoading(false)
          }
      } 
  
    const getLoggedInUser = async () => {
        let resp = await requestHandler.get('user', true);
        let token = localStorage.getItem('token');
        if(token != null && resp != null && resp.requestSuccessful == true){
            setUserData(resp.responseBody)
            setFirstName(resp.responseBody.firstname)
            setLastName(resp.responseBody.lastname)
            setPhoneNumber(resp.responseBody.phone)
            setGender(resp.responseBody.gender.toLowerCase())
            setIsUserLoggedIn(true)
        }
        else {
            location.href="/"
        }
        console.log(resp)  
      }
  
      const logOut = () => {
        localStorage.removeItem('token')
        location.href="/"
      }
  
      useEffect(()=>{
        getLoggedInUser()
      },[])

      
  return (

    <div className='flex flex-row grid grid-cols-1 gap-4 py-10 lg:gap-8'>
     
                {!editProfile?
        <div className="container w-full lg:mt-5">
          {/* Profile Picture */}
          <div className="flex flex-row justify-center mb-4">
            <img
              src={AppImages.avatar} // Replace with your image path
              alt="Profile Picture"
              className="w-32 h-32 rounded-full"
            />
          </div>
          
          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">{userData.firstname} {userData.lastname}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
            <p className="text-gray-600">{userData.gender}</p>
            <p className='text-blue-500 py-5' onClick={()=>setEditProfile(true)}>Edit Profile</p>
          </div>

          {/* Statistics */}
          <div className="flex justify-around mb-6">
            
            {/*<div className="text-center">
              <strong className="text-xl">{userData.userId}</strong>
              <span className="text-gray-600 block">ID</span>
            </div>*/}

           {/* <div className="text-center">
              <strong className="text-xl">1234</strong>
              <span className="text-gray-600 block">Followers</span>
            </div>
            <div className="text-center">
              <strong className="text-xl">567</strong>
              <span className="text-gray-600 block">Following</span>
            </div>*/}
          </div>

          {/* Buttons */}
          {/*<div className="flex justify-around mb-6">
            <button onClick={()=>setEditProfile(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Edit Profile</button>
            <button onClick={logOut} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
          </div>*/}

          {/* <h3 className="text-xl font-bold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 p-4 rounded-lg">Become a seller</div>
            <div className="bg-gray-200 p-4 rounded-lg">Achievement 2</div>
            <div className="bg-gray-200 p-4 rounded-lg">Achievement 3</div>
            <div className="bg-gray-200 p-4 rounded-lg">Achievement 4</div>
          </div>*/}
        </div>

:

<div className="container w-full lg:mt-5">
<div className="flex flex-col justify-center mb-4">
      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center w-full">
        <div>  
      <label className="block text-gray-700">First Name</label>
      <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter First Name"
          className="w-full p-2 mb-4 border rounded"
        />
        </div>
        <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter Last Name"
          className="w-full p-2 mb-4 border rounded"
        />
        </div>
        <div className="w-full mt-3 mb-4">
          <label className="block mb-2">Gender:</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="male" className="mr-4">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="female">Female</label>
          </div>
        </div>
        <div className="w-full mt-3 mb-4">
        {/*<label className="block text-gray-700">Phone <span className='text-gray-400'></span></label>*/}
        <PhoneInput
          country={'ng'}
          placeholder='+23480987654321'
          value={phoneNumber}
          onChange={phone => setPhoneNumber(phone)}
          inputclassName="w-full mb-4 p-2 border rounded"
        />
        <div className='text-gray-500 text-sm'>(E.g. {"+2348012345678"})</div>
        </div>
        
      </form>
      </div>
      <div className='lg:w-full items-center lg:px-4 w-80 mt-5'>
      
{
  loading? <LoadingSpinner loading={loading} />
  :
  <button onClick={handleUpdate} type="submit" className="w-full p-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600">
  Update Profile
</button>
}
      </div>
    </div>
}

    </div>
  );
}
