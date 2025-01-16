"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import requestHandler from '../../utils/requestHandler';
import endpointsPath from '../../constants/EndpointsPath';
import AppStrings from '../../constants/Strings';
import Spinner from '../../utils/loader';

const Verification = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    face_image : null,
    face_smile_image: null,
    id_front: null,
    id_back: null,
    id_type: ''
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [locationSaved, setLocationSaved] = useState(false)
  const [idCardFrontPreview, setIdCardFrontPreview] = useState('');
  const [idCardBackPreview, setIdCardBackPreview] = useState('');
  const idTypes = ["National ID card", "International Passport", "Driver License", "Voter Card"]
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleLocation = async () => {
    setLoading(true)
    try {
      const data = {
        longitude: location.latitude,
        latitude: location.longitude
      }
      const req = await requestHandler.post(endpointsPath.location+'/create', data, true)
            if(req.statusCode === 200){
              setLocationSaved(true)
            }
            else {
              toast.error("Failed. Make sure your location is on and try again.")
            }
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude, error: null });
          //handleLocation();
        },
        (error) => {
          toast.error(error.message)          
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.")
    }
  };

  useEffect(() => {
    const getFiles = async() => {
        setLoading(true)
        try {
            const req = await requestHandler.get(endpointsPath.verificationFiles, true)
        if(req.statusCode === 200){
            setUploadedFiles(req.result.data)
        }
        } catch (e) {
            console.log(e)
        }
        finally{
            setLoading(false)
        }
    } 
    getFiles()

    //get location
    getLocation()

  },[])


  const uploadIds = async () => {
    setLoading(true)
    try{
        const data = new FormData();
        data.append('id_front', formData.id_back);
        data.append('id_back', formData.id_front);
        data.append('id_type', formData.id_type);
            const req = await requestHandler.postForm(endpointsPath.uploadIds, data, true);
      if (req.statusCode === 200){
        toast.success(req.result.message)
        router.push('/sell');
      }
      else {
        toast.error(req.result.message || 'Upload failed')
        setLoading(false);
      }
    }
    catch(e) {
        toast.error(AppStrings.internalServerError);
        setLoading(false);
    }
  }
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === 'id_front') {
          setIdCardFrontPreview(reader.result);
        } 
        if (fieldName === 'id_back') {
          setIdCardBackPreview(reader.result);
        }
        setFormData({
          ...formData,
          [fieldName]: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdTypeChange = (e) => {
    setFormData({
      ...formData,
      id_type: e.target.value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadIds();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div>Loading...</div>
      </div>
    );
  }

  if (!locationSaved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col">
        <div>Location Verification</div>
        <div className="text-center">
          <button onClick={handleLocation} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Proceed
          </button>
        </div>
        </div>
      </div>
    );
  }

 if(locationSaved) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-4 mb-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">Verification Step {step} of 2</h2>

{step === 1 && (
          <div className="space-y-4">
            <div>
            <label className="block mb-1" htmlFor="country">ID Type</label>
            <select onChange={handleIdTypeChange} id="country" name="id_type" value={formData.id_type} className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select a ID type</option>
              {idTypes.map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
            <p className="text-lg">Upload a recognized ID card: <b>{formData.id_type != ''? <span>Upload {formData.id_type} Front</span> : 'Upload Front' }</b></p>
            <input type="file" accept="image/*" name="id_front" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
            {idCardFrontPreview && <img src={idCardFrontPreview} alt="ID Card Front Preview" className="mt-4 w-32 h-32 object-cover rounded mx-auto" />}
            <div className="flex justify-between">
              <button onClick={handleNextStep} className="mt-10 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Next
                </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-lg">Upload a recognized ID card: <b>{formData.id_type != ''? <span>Upload {formData.id_type} Back</span> : 'Upload Back' }</b></p>
            <input type="file" accept="image/*" name="id_back" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
            {idCardBackPreview && <img src={idCardBackPreview} alt="ID Card Back Preview" className="mt-4 w-32 h-32 object-cover rounded mx-auto" />}
            <div className="flex justify-between">
              <button onClick={handlePrevStep} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Previous</button>
              {loading? <Spinner loading={true}/> : <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
