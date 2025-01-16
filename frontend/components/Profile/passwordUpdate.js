"use client"
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import endpointsPath from '../../constants/EndpointsPath';
import requestHandler from '../../utils/requestHandler';

const UpdatePasswordComponent = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);


    const data = {
        "current_password": currentPassword,
        "password": newPassword,
        "confirm_password": confirmNewPassword
      } 

    try {
      const response = await requestHandler.post(`${endpointsPath.user}/update/password`, data, true);

      if (response.statusCode !== 200) {
        toast.error(response.result.message || 'Error updating password');
      } else {
        toast.success(response.result.message);
        setNewPassword('')
        setConfirmNewPassword('')
        setCurrentPassword('')
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('Error updating password');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto py-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Update Password</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => handleChange(e, setCurrentPassword)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => handleChange(e, setNewPassword)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => handleChange(e, setConfirmNewPassword)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default UpdatePasswordComponent;
