"use client"
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import Link from 'next/link';
import requestHandler from '../../utils/requestHandler';
import Spinner from '../../utils/loader';
import OAuth2Component from './oauth2';
import { FloatingLabel } from 'flowbite-react';
import Strings from '../../constants/Strings';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LoginComponent = (props) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
    }
  };


  function showConfirmation() {
    const userConfirmed = confirm("Seems you are new. Do you want to proceed and create an account?");
    
    if (userConfirmed) {
      location.href='/signup'
      // Add any action you want to perform on Yes
    } else {
      //alert("You chose No.");
      // Add any action you want to perform on No
    }
  }

  const handleEmailVerification = async (e) => {
    setLoading(true)
    e.preventDefault();
    
      try{
        const data = {
          email: email
        }
        let resp = await requestHandler.post('auth/verify', data, false);
        if(resp.statusCode === 200){
            setEmailSubmitted(true);
            setLoading(false)
        }
        else if(resp.statusCode === 500){
          toast.error(Strings.internalServerError)
          setLoading(false)
      }
      else{
            showConfirmation()
            setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        toast.error(Strings.internalServerError)
        setLoading(false)
      }
  }

  const handleLogin = async (e) => {
    setLoading(true)
    setIsWrongPassword(false)
    e.preventDefault();
    
      try{
        const data = {
          password: password,
          email: email
        }
        let resp = await requestHandler.post('auth/login', data, false);
        if(resp.statusCode === 200){
              localStorage.setItem("token", resp.result.token)
              let redirectUrl = localStorage.getItem("redirect_url");
              let url = props.redirectUrl == null || props.redirectUrl == ''? "/" :  props.redirectUrl
              if(resp.result.user.role=='Admin') location.href="/admin/"
              localStorage.removeItem("redirect_url");
              location.href=redirectUrl || url;
        }
        else{
          setIsWrongPassword(true)
          toast.error(resp.result.message)
          setEmailSubmitted(false);
          
        }
        console.log(resp)  
      }
      catch(e){
        toast.error(Strings.internalServerError)
        
      }
      finally{
        setLoading(false)
      }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      {!emailSubmitted ? (
        <form onSubmit={handleEmailVerification} className="p-5 w-80">
          <FloatingLabel
            variant="outlined"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
          />
          <Spinner loading={loading} />
          <Button style={{display: loading? 'none':'flex'}} type="submit" variant="contained" color="primary" className="w-full">
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="w-80">
          <FloatingLabel
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            color={isWrongPassword? 'error' : 'default'}
            helperText={isWrongPassword? "You entered a wrong password." : ""}
            className="mb-4"
          />
          <p className="mb-4 flex justify-center">Forgot password?<a href="/reset-password" className="text-blue-500"> <span className='ml-1'>Reset</span> </a></p>
          <Spinner loading={loading} />
          <Button style={{display: loading? 'none':'flex'}} type="submit" variant="contained" color="primary" className="w-full">
            Login
          </Button>
        </form>
      )}
      <p className="mt-4">Don&#39;t have an account?<Link href="/signup" className="text-blue-500 ml-2">Sign Up</Link></p>
      <OAuth2Component/>
    </div>
  );
}

export default LoginComponent;