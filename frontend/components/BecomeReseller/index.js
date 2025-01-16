import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import requestHandler from '../../utils/requestHandler';
import maskPhoneNumber from '../../utils/maskPhoneNumber';
import HandleCodeVerification from '../Auth/HandleCodeVerification';

const BecomeSellerForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [primaryContactPersonName, setPrimaryContactPersonName] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [primaryContactPhoneNumber, setPrimaryContactPhoneNumber] = useState('');
  const [marketName, setMarketName] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [businessCategory, setBusinessCategory] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [businessRegistrationImage, setBusinessRegistrationImage] = useState(null);
  const [taxIDImage, setTaxIDImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const [statesAndMarkets, setStateAndMarkets] = useState([])
  const [selectedState, setSelectedState] = useState([])
  const [categories, setCategories] = useState([])
  const [markets, setMarkets] = useState([])

  const newCatObject = { 
    "id": "testId", 
    "createdAt": 
    "2024-03-12T00:29:55.000", 
    "updatedAt": "2024-03-12T00:29:55.000", 
    "businessCategoryRef": "", 
    "name": "Others", 
    "market": null 
  };

  const newMarketObject = {
    "id":"674ab6947780ed2babc966564445a9",
    "createdAt":"2024-11-30T06:54:12.499",
    "updatedAt":"2024-11-30T06:54:12.499",
    "marketRef":"Others",
    "name":"Others",
    "state":{},
    "address":"",
    "categories":null,
    "shops":null,
    "images":{}
  }

  const filterMarketByState = (id) => {
    setMarketName('')
    setMarkets([])
    try {
      let fMarkets = statesAndMarkets.filter(x => x.state.name == id)
    if(id == "" || fMarkets.length < 1){
//      let uniqueResult = Array.from(new Set(newCatObject));
      setMarkets([])
      setMarketName('')
    }
    else if (fMarkets != null && fMarkets.length > 0 && fMarkets[0].markets.length > 0){
      let result = fMarkets[0].markets;
      result.push(newMarketObject);
        setMarkets(result)
    }
    } catch (error) {
     console.log(error) 
    }
  }



useEffect(()=>{
  const getMarkets = async () => {
    //setLoading(true)
        let resp = await requestHandler.get('states', false);
        if(resp != null && resp.requestSuccessful == true){
          let result = resp.responseBody;
            setStateAndMarkets(result)
            //setLoading(false)
            //get markets for first state
            let firstState = result[0]?.state?.name;
            setSelectedState(firstState)
            filterMarketByState(firstState);
        }
        console.log(resp)  
}

const getCategories = async () => {
      let resp = await requestHandler.get('category', false);
      if(resp != null && resp.requestSuccessful == true){
        let result = resp.responseBody;
        //result.push(newCatObject)
        setCategories(result)
      }
      console.log(resp)  
}
    getMarkets()
    getCategories()
},[])

  const handleChange = (e, setter) => {
    const { files } = e.target;
    setter(files ? files[0] : e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setDeliveryOptions((prevOptions) =>
      checked ? [...prevOptions, value] : prevOptions.filter((option) => option !== value)
    );
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    let deliveryOp = [];
    if(deliveryOptions[0] == 'In-store Pickup' && deliveryOptions[1] == 'Delivery'){
      deliveryOp = ['In_store_Pickup', 'Delivery']
    }
    else if(deliveryOptions[1] == 'In-store Pickup' && deliveryOptions[0] == 'Delivery'){
      deliveryOp = ['In_store_Pickup', 'Delivery']
    }
    else if(deliveryOptions[0] == 'In-store Pickup' || deliveryOptions[1] == 'In-store Pickup' || deliveryOptions[2] == 'In-store Pickup'){
      deliveryOp = ['In_store_Pickup']
    }
    else if(deliveryOptions[0] == 'Delivery' || deliveryOptions[1] == 'Delivery' || deliveryOptions[2] == 'Delivery'){
      deliveryOp = ['Delivery']
    }
    else{
      deliveryOp = ['In_store_Pickup']
    }
    //make array unique
    //const deliveryOptionsUniqueArray = [...new Set(deliveryOptions)];

    const data = new FormData();
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('email', email);
    data.append('gender', gender.toUpperCase());
    data.append('dateOfBirth', dateOfBirth);
    data.append('password', password);
    data.append('phoneNumber', phoneNumber);
    data.append('shopName', shopName);
    data.append('shopAddress', shopAddress);
    data.append('businessRegistrationNumber', businessRegistrationNumber);
    data.append('taxId', taxId);
    data.append('primaryContactPersonName', primaryContactPersonName);
    data.append('primaryContactEmail', primaryContactEmail);
    data.append('primaryContactPhoneNumber', primaryContactPhoneNumber);
    data.append('marketName', marketName);
    data.append('deliveryOptions', deliveryOp);
    data.append('businessCategory', businessCategory);
    data.append('shopDescription', shopDescription);
    data.append('businessRegistrationImage', businessRegistrationImage);
    data.append('taxIDImage', taxIDImage);

    try {
      const response = await fetch(`${process.env.baseUrl}auth/request-to-be-seller`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const result = await response.json();
        if(result['errors']) toast.error(result['errors'][0]);
        else toast.error(result.responseMessage);
      } else {
        toast.success('Application successful');
        //location.href='/login'
        setSignedUp(true)
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('Error submitting form');
    }
    setLoading(false);
  };

  const capitalizeLabel = (label) => {
    return label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <>
        {signedUp?

<HandleCodeVerification phone={phoneNumber} password={password} email={email} isPasswordReset={false} veriftWithEmail={false} />

      :
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Request to Become a Seller</h2>
      
      {[
        { label: 'First Name', value: firstName, setter: setFirstName },
        { label: 'Last Name', value: lastName, setter: setLastName },
        { label: 'Email', value: email, setter: setEmail },
        { label: 'Gender', value: gender, setter: setGender, type: 'select', options: ['Male', 'Female'] },
        { label: 'Date Of Birth', value: dateOfBirth, setter: setDateOfBirth, type: 'date' },
        { label: 'Password', value: password, setter: setPassword, type: 'password' },
        { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password' },
        { label: 'Phone Number (+23481....)', value: phoneNumber, setter: setPhoneNumber },
        { label: 'Shop Name', value: shopName, setter: setShopName },
        { label: 'Shop Address', value: shopAddress, setter: setShopAddress },
        { label: 'Business Registration Number', value: businessRegistrationNumber, setter: setBusinessRegistrationNumber },
        { label: 'Tax ID', value: taxId, setter: setTaxId },
        { label: 'Primary Contact Person Name', value: primaryContactPersonName, setter: setPrimaryContactPersonName },
        { label: 'Primary Contact Email', value: primaryContactEmail, setter: setPrimaryContactEmail },
        { label: 'Primary Contact Phone Number', value: primaryContactPhoneNumber, setter: setPrimaryContactPhoneNumber }, 
        /*{ label: 'State', setter: setSelectedState, type: 'select', options: statesAndMarkets.map(x => ({ value: x.state['name'], label: x.state['name'] })) },
        marketName == 'Others'? { label: 'Market Name', value: marketName, setter: setMarketName }
        : { label: 'Market Name', setter: setMarketName, type: 'select', options: markets.map(x => ({ value: x.name, label: x.name })) },
        ,*/
        { label: 'Delivery Options', type: 'checkbox', options: ['In-store Pickup', 'Delivery'] },
        { label: 'Business Category', setter: setBusinessCategory, type: 'select', options: categories.map(category => ({ value: category.name, label: category.name })) },
        //{ label: 'Business Category', value: businessCategory, setter: setBusinessCategory },
        { label: 'Shop Description', value: shopDescription, setter: setShopDescription },
        { label: 'Business Registration Image', value: businessRegistrationImage, setter: setBusinessRegistrationImage, type: 'file', accept: 'image/png, image/jpeg' },
        { label: 'Tax ID Image', value: taxIDImage, setter: setTaxIDImage, type: 'file', accept: 'image/png, image/jpeg' },
      ].map(field => (
        <div key={field.label} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.label}>
            {capitalizeLabel(field.label)}
          </label>
          {field.type === 'select' ? (
            <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={field.label}
            value={field.value}
            onChange={(e) => {handleChange(e, field.setter);}}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (

              <option key={option.value || option} value={option.value}>{option.label || option}</option>
            ))}
          </select>
          ) : field.type === 'checkbox' ? (
            field.options.map(option => (
              <div key={option} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    value={option}
                    onChange={handleCheckboxChange}
                  />
                  <span className="ml-2">{option}</span>
                </label>
              </div>
            ))
          ) : (
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={field.label}
              name={field.label}
              type={field.type || 'text'}
              onChange={(e) => handleChange(e, field.setter)}
              value={field.type === 'file' ? undefined : field.value}
            />
          )}
        </div>
      ))}
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={'State'}>
            {'State'}
          </label>
      <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => {setSelectedState(e.target.value); filterMarketByState(e.target.value);}}
          >
            <option value="">Select State</option>
            {statesAndMarkets.map(x => (

              <option key={x.state['name']} value={x.state['name']}>{x.state['name']}</option>
            ))}
          </select>
    
            <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={'Market Name'}>
            {'Market Name'}
          </label>
          { marketName == "Others"?
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type={'text'}
              placeholder='Enter market name'
              onChange={(e) => setMarketName(e.target.value)}
            />
            :
      <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => {setMarketName(e.target.value);}}
          >
            <option value="">Select Market</option>
            {markets.length > 0? markets.map(x => (

              <option key={x.state['name']} value={x['name']}>{x['name']}</option>
            )) : <option value="Others">Others</option>}
          </select>
        }
          </div>
      
      <div className="mt-4 flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
}
</>

  );
};

export default BecomeSellerForm;
