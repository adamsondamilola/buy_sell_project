'use client'
import React, { useEffect, useState } from 'react';
import requestHandler from '../../../../utils/requestHandler';
import { toast } from 'react-toastify';
import Strings from '../../../../constants/Strings';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Countries from '../../../../constants/Countries';
import { useParams, useRouter } from 'next/navigation';
import endpointsPath from '../../../../constants/EndpointsPath';

const AdminEditUserComponent = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState(Countries.countries)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [formData, setFormData] = useState({
    phone: '',
    whatsapp: '',
//    profile_picture: null, // Updated to handle file input
    country: '',
    state: '',
    city: '',
    username: '',
    shop_name: '',
    shop_description: '',
    shop_address: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await requestHandler.get(`${endpointsPath.userAdmin}/${id}`, true);
        if (response.statusCode === 200) {
            let result = response.result.data.user;
            setUser(result);
            setFormData({
                ...formData,
                phone: result.phone,
                whatsapp: result.whatsapp,
                country: result.country,
                state: result.state,
                city: result.city,
                username: result.username,
                shop_name: result.shop_name,
                shop_description: result.shop_description,
                shop_address: result.shop_address
            });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleCountryChange = (e) => {
    const states_ = countries.filter( x => x.name === e.target.value)
    setStates(states_[0].states)
    setFormData({
      ...formData,
      country: e.target.value,
      state: '',
      city: ''
    });
  }

  const handleStateChange = (e) => {
    const cities_ = states.filter(x => x.name === e.target.value)
    if(cities_[0]?.subdivision == null){
      setCities(states)
    } else setCities(cities_[0].subdivision)
    setFormData({
      ...formData,
      state: e.target.value,
      city: ''
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({
        ...formData,
        profile_picture: file
      });
    }
  };

  const handlePhoneChange = (value, name) => {
    if(value[0] != "+") value = "+"+value
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    /*
    const formdata = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formdata.append(key, formData[key]);
      }
    }*/

    

    try {
      const req = await requestHandler.patch(`${endpointsPath.userAdmin}/${id}`, formData, true);
      if (req.statusCode === 200) {
        toast.success(req.result.message);
        router.push('/admin/users/view/'+id, undefined, {shallow:true})
      } else {
        toast.error(req.result.message);
      }
    } catch (error) {
      toast.error(Strings.internalServerError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid overflow-x-auto no-scrollbar grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1" htmlFor="phone">Phone</label>
              <PhoneInput
                country={'ng'}
                onlyCountries={['ng', 'gh', 'ke', 'za', 'zm']}
                value={formData.phone}
                onChange={(value) => handlePhoneChange(value, 'phone')}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true
                }}
                inputClass="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="whatsapp">WhatsApp</label>
              <PhoneInput
                country={'ng'}
                onlyCountries={['ng', 'gh', 'ke', 'za', 'zm']}
                value={formData.whatsapp}
                onChange={(value) => handlePhoneChange(value, 'whatsapp')}
                inputProps={{
                  name: 'whatsapp',
                  required: true,
                }}
                inputClass="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          {/*<div>
            <label className="block mb-1" htmlFor="picture">Profile Picture</label>
            <input type="file" accept="image/png, image/jpeg" id="picture" name="picture" onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded" />
            {imagePreview && <div className='flex flex-col items-center'><img src={imagePreview} alt="Profile Preview" className="mt-4 w-32 h-32 object-cover rounded-full" /></div>}
          </div>*/}
          <div>
            <label className="block mb-1" htmlFor="country">Country</label>
            <select id="country" name="country" value={formData.country} onChange={handleCountryChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select a country</option>
              {countries.map((x) => (
                <option key={x?.name} value={x?.name}>{x?.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1" htmlFor="state">State</label>
              <select id="state" name="state" value={formData.state} onChange={handleStateChange} className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state?.name} value={state?.name}>{state?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1" htmlFor="city">City</label>
              <select id="city" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" disabled={!formData.state}>
                <option value="">Select a city</option>
                {formData.state && cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1" htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="shop_name">Business Name</label>
            <input type="text" id="shop_name" name="shop_name" value={formData.shop_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="shop_description">Business Description</label>
            <textarea id="shop_description" name="shop_description" value={formData.shop_description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded"></textarea>
          </div>
          <div>
            <label className="block mb-1" htmlFor="shop_address">Business Address</label>
            <input type="text" id="shop_address" name="shop_address" value={formData.shop_address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditUserComponent;
