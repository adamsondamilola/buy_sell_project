import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import requestHandler from '../../../utilities/requestHandler';
import { toast } from 'react-toastify';
import maskPhoneNumber from '../../../utilities/maskPhoneNumber';
import maskEmailAddress from '../../../utilities/maskEmailAddress';

export default function HandleCodeVerification(props) {
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(props.phone);
  const [isPasswordReset, setIsPasswordReset] = useState(props.isPasswordReset);
  const [createPassword, setCreatePassword] = useState(false);
  const [veriftWithEmail, setVeriftWithEmail] = useState(props.veriftWithEmail);
  const [code, setCode] = useState('');
  const [isLoading, setLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const handleCodeValidation = async (e) => {
    e.preventDefault();    
    setLoading(true)
    
      try{
        const data = {
          email: email,
          verifyWithEmail: veriftWithEmail
        }
        let resp = await requestHandler.patch(`auth/activate/${code}`, data, false);
        if(resp != null && resp.requestSuccessful == true){
              toast.success("Activation successful")
              if(!isPasswordReset) handleLogin();
              else setCreatePassword(true)
        }
        else{
          
          let err = resp["errors"][0]
          toast.error(err)
          setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        
        let err = "Internal server error"
        toast.error(err)
        setLoading(false)
      } 
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true)
    
      try{
        const data = {
            "email": email,
            "otp": code,
            "newPassword": password,
            "verifyWithEmail": veriftWithEmail
          }
        let resp = await requestHandler.patch(`auth/forget-password`, data, false);
        if(resp != null && resp.requestSuccessful == true){
              toast.success("Password reset successfully")
              handleLogin();
        }
        else{
          
          toast.error(resp["errors"][0] || 'Password reset failed, please try again.')
          setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        
        let err = "Internal server error"
        toast.error(err)
        setLoading(false)
      } 

    setLoading(false);
  };


  //validate otp


  const handleLogin = async () => {
    
    setLoading(true)
    
      try{
        const data = {
          password: password,
          email: email,
          rememberMe: true,
          platform: "USER"
        }
        let resp = await requestHandler.post('auth/login', data, false);
        if(resp != null && resp.requestSuccessful == true){
              //setLoading(false)
              //redirect to account settup
              localStorage.setItem("token", resp.responseBody.token)
              //location.href="/seller/setup"
              location.href="/"
        }
        else{
          location.href="/login"
        }
        console.log(resp)  
      }
      catch(e){
        location.href="/login"
      }
  }


  return (
    <div className='flex flex-col items-center rounded w-full py-20 p-10'>

        <div className='flex flex-col w-full items-center' style={{display: createPassword? 'none' : 'flex'}}>
<div>A verification code has been sent to {!veriftWithEmail? maskPhoneNumber(phoneNumber) : maskEmailAddress(email)}. Enter the code below and verify to proceed</div>
<form onSubmit={handleCodeValidation} className="items-center w-full">
<div className='flex flex-col items-center'>
  <br/>
<label className="block text-gray-700"></label>
<input
type="text"
value={code}
onChange={(e) => setCode(e.target.value)}
placeholder="Enter Code"
className="lg:w-1/2 w-full p-2 mb-4 border rounded"
/>
</div>
<div className="flex flex-col items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed w-full lg:w-1/2' : 'w-full lg:w-1/2'}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
</form>
</div>

<div className='flex flex-col w-full items-center' style={{display: !createPassword? 'none' : 'flex'}}>
<div>Create New Password</div>
<form onSubmit={handlePasswordReset} className="items-center w-full">
<div className='flex flex-col items-center'>
  <br/>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="lg:w-1/2 w-full p-2 mb-4 border rounded"
        />
        <label className="block text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="lg:w-1/2 w-full p-2 mb-4 border rounded"
        />
</div>
<div className="flex flex-col items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed w-full lg:w-1/2' : 'w-full lg:w-1/2'}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
</form>
</div>

</div>
  );
}
