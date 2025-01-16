import Link from 'next/link';
import { useState } from 'react';
import requestHandler from '../../../utilities/requestHandler';
import { toast } from 'react-toastify';
import MessageAlert from '../../../utilities/messageAlert';
import LoadingSpinner from '../../../utilities/loader';
import HandleCodeVerification from '../HandleCodeVerification';

export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null)
  const [verifyCode, setVerifyCode] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [createNewPassword, setCreateNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    setHasError(false)
    setLoading(true)
    e.preventDefault();
    //let phone = phoneNumber;
    if(email == ""){
      toast.error("Enter email address")
    }
    else {
      try{
        const data = {
          email: email,
          verifyWithEmail: true
        }
        let resp = await requestHandler.post('auth/forget-password', JSON.stringify(data), false);
        if(resp != null && resp.requestSuccessful == true){
              setLoading(false)
              toast.success(resp.responseMessage)
              setVerifyEmail(true)
              //return to page if not signup or reset password page, else, return to home page
              //save token
              localStorage.setItem("token", "")
        }
        else{
          setHasError(true)
          let err = resp["errors"][0]
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
  };


  return (
    <>
    {verifyEmail?
      <HandleCodeVerification phone={''} password={''} email={email} isPasswordReset={true} veriftWithEmail={true} />
      :
        <div className="flex flex-col w-full items-center justify-center">
        {/*<h1 className="text-4xl font-bold mt-5 mb-8">Forgot Password</h1>*/}
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <form className='w-full' onSubmit={handleForgotPassword}>
         <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
</div>
          <div className='lg:w-96'>

        {
          loading? <LoadingSpinner loading={loading} />
          :
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
}
</div>
        </form>
      </div>
      <div className="flex justify-between mt-4 mb-10">
          <div className='mr-5'>Remember password? </div>
         <a href="/login" className="text-blue-500 hover:underline">Login
          </a>
        </div>
    </div>
}
    </>
  );
}
