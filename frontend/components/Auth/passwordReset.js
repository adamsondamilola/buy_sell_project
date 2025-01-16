"use client"
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import OAuth2Component from '../../components/Auth/oauth2';
import requestHandler from '../../utils/requestHandler';
import { toast } from 'react-toastify';
import Strings from '../../constants/Strings';
import Link from 'next/link';
import Spinner from '../../utils/loader';
import { FloatingLabel } from 'flowbite-react';
import maskEmail from '../../utils/maskEmail';



export default function PasswordResetComponent() {
    const [email, setEmail] = useState(null);
    const [code, setCode] = useState(null);
    const [codeVerified, setCodeVerified] = useState(false);
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [loading, setLoading] = useState(false);


  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true)
    
      try{
        const data = {
          email: email
        }
        let resp = await requestHandler.post('auth/verify', data, false);
        if(resp.statusCode === 200){
            //send code
            let response = await requestHandler.post('auth/password_request_code', data, false);
            if(response.statusCode === 200) setEmailSubmitted(true);
            else toast.error(response.result.message)
            setLoading(false)
      }
      else if(resp.statusCode === 500){
        toast.error(Strings.internalServerError)
        setLoading(false)
    }
    else{
            toast.error('Account not found')
            setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        toast.error(Strings.internalServerError)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
  }

  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setLoading(true)
    
      try{
        const data = {
          email: email,
          code: code
        }
        let resp = await requestHandler.post('auth/password_request_code_verification', data, false);
        if(resp.statusCode === 200){
            setCodeVerified(true);
          setLoading(false)
      }
      else if(resp.statusCode === 500){
        toast.error(Strings.internalServerError)
        setLoading(false)
    }
    else{
            toast.error(resp.result.message)
            setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        toast.error(Strings.internalServerError)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
  }

  const handlePasswordReset = async (e) => {
    setLoading(true)
    e.preventDefault();
    
      try{
        const data = {
            code: code,
          password: password,
          confirm_password: confirmPassword,
          email: email
        }
        let resp = await requestHandler.post('auth/password_reset', data, false);
        if(resp.statusCode === 200){
              location.href="/login"
        }
        else{
          toast.error(resp.result.message)
          setLoading(false)
        }
        console.log(resp)  
      }
      catch(e){
        toast.error(Strings.internalServerError)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-6">Password Reset</h1>
      {!emailSubmitted ? (
        <form onSubmit={handleEmailVerification} className="p-5 w-80">
          <FloatingLabel
            variant="outlined"
            label="Email address"
            //defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
          />
          <Spinner loading={loading} />
          <Button style={{display: loading? 'none':'flex'}} type="submit" variant="contained" color="primary" className="w-full">
            Continue
          </Button>
        </form>
      ) 
      : 
      !codeVerified ? (
        <form onSubmit={handleCodeVerification} className="p-5 w-80">
            <div className='mb-2'>
                A verification code has been sent to {maskEmail(email)}
            </div>
          <FloatingLabel
            variant="outlined"
            label="Verification Code"
            //defaultValue={email}
            onChange={(e) => setCode(e.target.value)}
            required
            className="mb-4"
          />
          <Spinner loading={loading} />
          <Button style={{display: loading? 'none':'flex'}} type="submit" variant="contained" color="primary" className="w-full">
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset} className="p-5 w-80">
          <FloatingLabel
            variant="outlined"
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <FloatingLabel
            variant="outlined"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mb-4"
          />
          <Spinner loading={loading} />
          <Button style={{display: loading? 'none':'flex'}} type="submit" variant="contained" color="primary" className="w-full">
            Reset Password
          </Button>
        </form>
      )}
      <p className="mt-4">Have an account?<Link href="/login" className="text-blue-500 ml-2" shallow>Login</Link></p>
      <OAuth2Component/>
      <div className='mb-10'></div>
    </div>
  );
}