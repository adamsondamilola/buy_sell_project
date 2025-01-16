'use client';
import { Facebook, Google } from '@mui/icons-material';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import requestHandler from '../../../../utils/requestHandler';
import Spinner from '../../../../utils/loader';

export default function AdminLoginComponent() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null)
  const [loading, setLoading] = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [loadingF, setLoadingF] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    setHasError(false)
    setLoading(true)
    e.preventDefault();
    
      try{
        const data = {
          password: password,
          email: email
        }
        let resp = await requestHandler.post('auth/login', JSON.stringify(data), false);
        if(resp != null && resp.requestSuccessful == true){
              //setLoading(false)
              //toast.success("Login successful")
              //return to page if not signup or reset password page, else, return to home page
              //save token
              localStorage.setItem("token", resp.responseBody.token)
              location.href="/"
        }
        else{
          setHasError(true)
          let err = resp.responseMessage?? resp['errors'][0]
          setResponseMessage(err)
          toast.error(err)
          setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        setHasError(true)
        let err = "Internal server error"
        setResponseMessage(err)
        toast.error(err)
        setLoading(false)
      }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white lg:p-8 lg:rounded lg:shadow-md w-full lg:max-w-md">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 bottom-2 focus:outline-none"
            >
              {passwordVisible ? <Eye/> : <EyeOff/>}
            </button>
          </div>

          {/*<MessageAlert.ErrorMessageAlert hasError={hasError} message={responseMessage} />*/}
          <div className="flex items-center justify-center mb-4 mt-4">
         <input type='checkbox' className='mt-0'/><div className='text-sm ml-3'> Remember me</div>
        </div>

        {
          loading? <Spinner loading={loading} />
          :
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
}
        </form>
        <div className="flex justify-between mt-4">
         <Link href="/" className="text-blue-500 hover:underline">
          </Link>
         <Link shallow href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?
          </Link>
        </div>
      </div>


    </div>
  );
}
