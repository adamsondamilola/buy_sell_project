import { useEffect, useState } from "react";
import endpointsPath from "../../../../constants/EndpointsPath";
import Countries from "../../../../constants/Countries";
import requestHandler from "../../../../utils/requestHandler";
import { AddPhotoAlternate, AddToPhotos, Favorite, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import details from "../../../../constants/Details";
import { Card } from "flowbite-react";
import camelCaseToTitleCase from "../../../../utils/camelCaseToTitleCase";
import Image from "next/image";
import { formatImagePath } from "../../../../utils/formatImagePath";
import limitArrayList from "../../../../utils/limitArrayList";
import formatNumberToCurrency from "../../../../utils/numberToMoney";
import { truncateText } from "../../../../utils/truncateText";
import RatingStars from "../../../RatingStars";
import { toast } from "react-toastify";
import AppStrings from "../../../../constants/Strings";
import Spinner from "../../../../utils/loader";
import { useRouter } from "next/navigation";
import categoryName from "../../../../constants/CategoryNames";
import AppImages from "../../../../constants/Images";

export default function AddProduct() {
  const [thumbnail, setThumbnail] = useState(null)
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [countries, setCountries] = useState(Countries.countries)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [brand, setBrand] = useState("")
  const [brands, setBrands] = useState([])
  const [images, setImages] = useState([])
  const [addFavorite, setAddFavorite] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sub_category: "",
    brand: "",
    images: [],
    colors: [],
    condition: "",
    country: "",
    state: "",
    city: "",
    details: {},
  });



  const handleCountryChange = (countr) => {
    const states_ = countries.filter( x => x.name === countr)
    setStates(states_[0].states)
    setFormData({
      ...formData,
      country: countr,
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

  useEffect(() => {
    const user = async () => {
      setLoading(true);
      try {
        const resp = await requestHandler.get(endpointsPath.profile, true);
        if (resp.statusCode === 200) {
          const result = resp.result.data.user;
          setCountry(result.country)
          handleCountryChange(result.country);
        }
      } catch (error) {
        console.log("Error checking user role:", error);
      } finally {
        setLoading(false);
      }
    };
    user();
  }, []);

  const colorsList = details.colorsList; 
  const conditionsList = details.conditionsList;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [properties, setProperties] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBrandQuery, setBrandSearchQuery] = useState("");

  const router = useRouter();

    // Handle search
    useEffect(() => {
      const searchResult = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(searchResult);
    }, [searchQuery, categories]);

    
    // Handle brand search
    useEffect(() => {
      const searchResult = brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchBrandQuery.toLowerCase()) ||
        brand.category_name.toLowerCase().includes(searchBrandQuery.toLowerCase())
      );
      setFilteredBrands(limitArrayList(searchResult, 5)); 
    }, [searchBrandQuery, brands]);

       // Handle brands
       useEffect(() => {
        const getBrands = async () => {
          const req = await requestHandler.get(`${endpointsPath.brand}/category/${categoryId}`, false)
        if(req.statusCode === 200) setBrands(req.result.data)
        }
        getBrands()
      }, [categoryId]); 

  const handleCategoriesProperties = (id, cat, subCat) =>{
    setBrand('')
    setCategoryId(id)
    setSelectedCategory(cat)
    setSelectedSubCategory(subCat)
    try{
      const x = categories.filter(x => x.name == cat)
      const prop = x[0].subCategories[0]['properties'][0];    
      setProperties(JSON.parse(prop))
  }catch(e) {
    setProperties([])
  }
    //alert(JSON.stringify())
  }
  
    useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await requestHandler.get(
          `${endpointsPath.category}`,
          true
        );
        let result = response.result.data;
        result = result.filter(x => x.name !== categoryName.Services && x.name !== categoryName.motorcyclesTricycles && x.name !== categoryName.vehicles && x.name !== categoryName.realEstate)
        const newCategories = result;
        setCategories(newCategories)
        setFilteredCategories(newCategories)
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
      finally{
          setLoading(false)
      }
    };
      fetchCategories();
    }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("details.")) {
      const detailKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [detailKey]: value },
      }));
    } else if (name === 'colors') {
      const selectedColors = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData((prevData) => ({
        ...prevData,
        colors: selectedColors
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files)
    const fileURLs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prevData) => ({
      ...prevData, 
      images: [...prevData.images, ...fileURLs],
    }));
    const firstFile = e.target.files[0];
    if(firstFile){
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result)
      }
      reader.readAsDataURL(firstFile);
    }
    
  };
  
  
  const handleRemoveImage = (index) => {
    // Update formData
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));

    // Update local images state
    const images_ = images.filter((_, i) => i !== index) || images;
    setImages(images_);
    // Update the thumbnail
    const firstFile = images_[0];
    if (firstFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(firstFile);
    } else {
      setThumbnail(''); // Reset thumbnail if no images are left
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {

      

      formData.brand = brand;
      formData.category = selectedCategory;
      formData.sub_category = selectedSubCategory;
      formData.images = "";
      formData.details = JSON.stringify(formData.details);
      const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach((image) => {
      data.append("images", image);
    });
      
      const response = await requestHandler.postForm(endpointsPath.product+"/create", data, true);
      
      if (response.statusCode == 200) {
        toast.success(response.result.message);
        setImages([])
        setBrand("") 
        setSelectedCategory("")
        setSelectedSubCategory("")
        setFormData({
          title: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          sub_category: "",
          brand: "",
          images: [],
          colors: [],
          condition: "",
          state: "",
          city: "",
          details: {},
        });
        setSelectedCategory("");
        router.push('/user/products')
      } else {
        toast.error(response.result.message || "Failed to add product");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
      toast.error(AppStrings.internalServerError);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1">
    <div className="max-w-4xl mx-auto p-6 w-full">
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

       {/* Images */}
<div>
  <label className="block mb-2 font-medium text-gray-700">
    Images (You can upload up to 5 images. First image will be used as the feature image)
  </label>
  <div className="flex items-center gap-4 flex-wrap">
    {/* Upload Button */}
    {formData.images.length < 5 && (
      <button
        type="button"
        onClick={() => document.getElementById("imageUpload").click()}
        className="w-24 h-24 bg-purple-950 text-white rounded-lg hover:bg-blue-600"
      >
        Add Image <AddToPhotos/>
      </button>
    )}
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      multiple
      className="hidden"
    />
    {/* Image Thumbnails */}
    {formData.images.length > 0 && formData.images.map((img, index) => (
      <div key={index} className="relative">
        <img
          src={img.preview}
          alt={`Uploaded ${index}`}
          className="w-24 h-24 object-cover rounded-lg shadow-md"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
    ))}
  </div>
</div>


        {/* Title */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full border rounded-lg p-2"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>
        </div>

        {/*Colors*/}
        <div>
        <label className="block mb-2 font-medium text-gray-700">Colors</label>
            <select
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              multiple
            >
              {colorsList.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

        {/*Condition*/}
        <div>
        <label className="block mb-2 font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value={''}>Select</option>
              {conditionsList.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

        {/* Category */}
        <div style={{display: !showCategories? 'flex' : 'none'}} className="flex flex-col">
          <label className="block mb-2 font-medium text-gray-700">Category</label>
          <select
            onClick={()=>{setShowCategories(true); setShowBrands(false);}}
            name="category"
            value={selectedCategory}
            className="w-full border rounded-lg p-2"
          >
            <option value="">{selectedCategory == ""? "-- Select Category --" : selectedSubCategory } </option>
          </select>
        </div>

        {/* Select Brands */}
        <div style={{display: !showBrands && selectedCategory != ""? 'flex' : 'none'}} 
        className="flex flex-col">
          <label className="block mb-2 font-medium text-gray-700">Brand</label>
          <select
            onClick={()=>setShowBrands(true)}
            name="brand"
            value={brand}
            className="w-full border rounded-lg p-2"
          >
            <option value="">{brand == ""? "-- Select Brand --" : brand } </option>
          </select>
        </div>

        {/* Brands */}
        <div style={{display: showBrands? 'flex' : 'none'}} className="rounded-lg flex flex-col">
        <label className="block mb-2 font-medium text-gray-700">Brand</label>
        {/* Search Box */}
      <input
        style={{display: brands.length > 0? 'flex' : 'none'}}
        type="text"
        placeholder="Search brands..."
        value={searchBrandQuery}
        onChange={(e) => setBrandSearchQuery(e.target.value)}
        className="mt-6 w-full border rounded-lg p-2 mb-6"
      />
        {filteredBrands?.map((br) => (
          <div key={br._id}>
              <Card 
                  key={br._id} 
                  onClick={()=>{setBrand(br.name); setShowBrands(false);}}
                  className="h-14 mb-2"
                  >
                    <div className="w-full flex flex-row justify-start items-center">
                    <Image alt="logo" src={formatImagePath(br?.image)} width={300} height={300}
                    className="w-10 h-10 flex object-cover rounded-lg shadow-md"
                    /> 
                    <p className="ml-2">{br?.name}</p>
                    </div>
                  </Card>
              </div>
            ))}

            {/* Enter Brand Name */}
      <input
      style={{}}
        type="text"
        placeholder="Enter brand name"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="mt-6 w-full border rounded-lg p-2 mb-6"
      />
        </div>

        {/* Categories and Sub Categories */}
        <div style={{display: showCategories? 'flex' : 'none'}} className="rounded-lg flex flex-col">
        <label className="block mb-2 font-medium text-gray-700">Category</label>
        {/* Search Box */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-6 w-full border rounded-lg p-2 mb-6"
      />
        {filteredCategories?.map((cat) => (
          <div key={cat._id}>
              <div className="font-bold">
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </div>
              {/*sub cats*/}
              {
                cat.subCategories.map((x) => (
                  <Card 
                  key={x._id} 
                  onClick={()=>{handleCategoriesProperties(cat._id, cat.name, x.name); setShowCategories(false);}}
                  className="mb-2 h-14 justify-center">
                    {x.name}
                  </Card>
                ))
              }
              </div>
            ))}
        </div>

        {/* Details (Dynamic Fields) */}
        {selectedCategory && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Details</h2>
            {properties.map((field) => (
              <div key={field}>
                <label className="block mb-2 font-medium text-gray-700">
                  {camelCaseToTitleCase(field)}
                  {/*field.charAt(0).toUpperCase() + field.slice(1)*/}
                </label>
                {field=="additionalInfo"?
                <textarea
                name={`details.${field}`}
                value={formData.details[field] || ""}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              ></textarea>
              :
                <input
                  type="text"
                  name={`details.${field}`}
                  value={formData.details[field] || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
                }
              </div>
            ))}
          </div>
        )}

        {/*Location*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block mb-2 font-medium text-gray-700">State</label>
              <select id="state" 
              name="state" value={formData.state} onChange={handleStateChange} 
              className="w-full border rounded-lg p-2">
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state?.name} value={state?.name}>{state?.name}</option>
                ))}
              </select>
            </div>
            <div>
            <label className="block mb-2 font-medium text-gray-700">City</label>
              <select id="city" name="city" 
              value={formData.city} 
              onChange={handleInputChange} 
              className="w-full border rounded-lg p-2" 
              disabled={!formData.state}>
                <option value="">Select a city</option>
                {formData.state && cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

        {/* Submit Button */}
        {loading? <Spinner loading={loading}/> : <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Add Product
        </button>}
        <p className="mb-10"></p>
      </form>
    </div>

    <div className="max-w-4xl mx-auto p-6 fixed right-0 hidden md:block xl:block w-1/3">
    <div className="grid grid-cols-1 gap-4">
      <div>
    <h1 className="text-3xl font-bold mb-4">Preview</h1>
<Card>
  <div className="relative h-52 bg-gray-300 flex rounded-lg shadow-md">
  <Image
  width={500}
  height={300}
  alt="thumbnail"
  src={thumbnail || AppImages.default}
  className={thumbnail? "h-52 w-full object-cover rounded-lg" : "object-cover"}
  />
  <div onClick={()=>{addFavorite? setAddFavorite(false): setAddFavorite(true)}} className="absolute top-2 right-2 bg-gray-100 text-purple-950 rounded-full shadow-md w-8 h-8 flex items-center justify-center"> 
  {addFavorite? <Favorite/> : <FavoriteBorderOutlined/>}
  </div>
  </div>
  <div className="grid grid-cols-1, gap-0">
  <div className="text-gray-500 space-y-10">{truncateText(formData.title, 20)}</div>
  <div className="font-bold text-2xl">{formatNumberToCurrency(formData.price)}</div>
  {/*<div className="text-gray-500">{<RatingStars score={5}/>}</div>*/}
  </div>
</Card>
</div>

<div>
<div className="font-bold">Description</div>
<div className="whitespace-pre text-wrap">{formData.description}</div>
</div>

</div>
</div>

    </div>
  );
}
