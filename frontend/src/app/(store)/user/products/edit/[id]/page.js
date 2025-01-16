"use client";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image'; // Import Image component if you're using Next.js
import { useParams } from 'next/navigation';
import requestHandler from '../../../../../../../utils/requestHandler';

const EditProductScreen = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [businessCategoryRef, setBusinessCategoryRef] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [colours, setColours] = useState([{ name: '', code: '' }]);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const params = useParams()
  const [id, setId] = useState(params.id)
  const [productRef, setProductRef] = useState(params.id)
  const [shopRef, setShopRef] = useState('')
  const [product, setproduct] = useState({})

  useEffect(() => {
    const getCategories = async () => {

        try {
        const data = localStorage.getItem('categories')
        if(data != null) setCategories(JSON.parse(data))
        } catch (error) {
            
        }

        let resp = await requestHandler.get('category', false);
        if (resp != null && resp.requestSuccessful === true) {
          setCategories(resp.responseBody);
          localStorage.setItem('categories', JSON.stringify(resp.responseBody))
        }
        console.log(resp);
      };
      getCategories();
  }, []);

  useEffect(()=>{
    const getproducts = async () => {
      setLoading(true)
      //alert(slug)
        try{
          let resp = await requestHandler.get('products/'+productRef, false);
        if(resp != null && resp.requestSuccessful == true){
            let result = resp.responseBody;
            setproduct(result)   
            setDescription(result.description)         
            setPrice(result.price)         
            setProductName(result.productName)   
            setShopRef(result.shopRef)      
        }
        setLoading(false)
        }
        catch(e){
          setLoading(false)
        }
  }
      getproducts()
  },[])


  const handleChange = (e, setter, setPreview) => {
    const { files, value } = e.target;
    if (files && files.length > 0) {
      const validImages = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (validImages.length === files.length) {
        setter(validImages);
        const previews = validImages.map(file => URL.createObjectURL(file));
        setPreview(previews);
      } else {
        toast.error('Please upload only image files.');
      }
    } else {
      setter(value);
      setPreview && setPreview(null);
    }
  };

  const handleColourChange = (e, index, key) => {
    const newColours = [...colours];
    newColours[index][key] = e.target.value;
    setColours(newColours);
  };

  const handleAddColour = () => {
    setColours([...colours, { name: '', code: '' }]);
  };

  const handleRemoveColour = (index) => {
    const newColours = colours.filter((_, i) => i !== index);
    setColours(newColours);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('productName', productName);
    data.append('price', price);
    data.append('businessCategoryRef', businessCategoryRef);
    data.append('description', description);
     images.forEach((image, index) => {
      data.append(`images`, image);
    });
    colours.forEach((colour, index) => {
      data.append(`colours.name`, colour.name);
      data.append(`colours.code`, colour.code);
    }); 

    const header = {
      'Accept': 'application/json',
      'x-shop-ref': shopRef,
      'Authorization': 'Bearer ' + requestHandler.getToken()
    };

    try {
      const response = await fetch(process.env.baseUrl + `admin/products/${productRef}`, {
        method: 'PATCH',
        headers: header,
        body: data,
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.responseMessage || 'Error submitting form');
      } else {
        toast.success('Product submitted successfully');
        // Clear form
       /* setProductName('');
        setPrice(0);
        setBusinessCategoryRef('');
        setDescription('');
        setImages([]);
        setImagesPreview([]);*/
        setColours([{ name: '', code: '' }]);
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('Error submitting form');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 lg:py-20">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      
      {/* Product Name */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">Product Name</label>
        <input
          id="productName"
          name="productName"
          type="text"
          value={productName}
          onChange={(e) => handleChange(e, setProductName)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      {/* Price */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          value={price}
          onChange={(e) => handleChange(e, setPrice)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Business Category Reference */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessCategoryRef">Business Category </label>
        <select
          id="businessCategoryRef"
          name="businessCategoryRef"
          value={businessCategoryRef}
          onChange={(e) => handleChange(e, setBusinessCategoryRef)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>Select a Category</option>
          {categories.map((x) => (
            <option key={x?.businessCategoryRef} value={x?.businessCategoryRef}>{x?.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => handleChange(e, setDescription)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Images (up to 5)</label>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleChange(e, setImages, setImagesPreview)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {imagesPreview && imagesPreview.length > 0 && (
          <div className="mt-2 grid grid-cols-5 gap-2">
            {imagesPreview.map((src, index) => (
              <div key={index} className="relative w-full h-20">
                <Image
                  src={src}
                  alt={`Image Preview ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colour Options */}
      {colours.map((colour, index) => (
        <div key={index} className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`colourName${index}`}>Colour Name</label>
            <input
              id={`colourName${index}`}
              name={`colourName${index}`}
              type="text"
              value={colour.name}
              onChange={(e) => handleColourChange(e, index, 'name')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`colourCode${index}`}>Colour Code</label>
            <input
              id={`colourCode${index}`}
              name={`colourCode${index}`}
              type="text"
              value={colour.code}
              onChange={(e) => handleColourChange(e, index, 'code')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-2 text-right">
            <button
              type="button"
              onClick={() => handleRemoveColour(index)}
              className="text-red-500 hover:text-red-700 font-bold py-2 px-4"
            >
              Remove Colour
            </button>
          </div>
        </div>
      ))}

      {/* Add Colour Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleAddColour}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Colour
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default EditProductScreen;
