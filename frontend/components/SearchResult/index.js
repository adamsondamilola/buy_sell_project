
"use client";

import { Card, Checkbox, Label, Modal, Select, TextInput } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import nigeriaStates from "../../constants/NigeriaStates";
import { Button } from "@mui/material";
import endpointsPath from "../../constants/EndpointsPath";
import requestHandler from "../../utils/requestHandler";
import Link from "next/link";
import { SearchComponent } from "../SearchItems";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "../../utils/loader";
import AppStrings from "../../constants/Strings";
import { truncateText } from "../../utils/truncateText";
import { MapPin } from "lucide-react";
import categoryName from "../../constants/CategoryNames";
import { toast } from "react-toastify";
import { SearchFilterComponent } from "../SearchFilter";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import { formatImagePath } from "../../utils/formatImagePath";

export function SearchResultComponent() {
  const [openModal, setOpenModal] = useState(false);

  const [state, setState] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [states, setStates] = useState(nigeriaStates)
  const [cities, setCities] = useState([])

  const [isSearchProducts, setIsSearchProducts] = useState(true);
  const [isSearchProperties, setIsSearchProperties] = useState(true);
  const [showProducts, setIsShowProducts] = useState(true);
  
  //properties

  const [products, setProducts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(null)
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q'); // Get the value of "q"
  const { condition, sub_category} = router.query || {};
  const searchProducts = async (page = 1) => {
      //if (loading || page > totalPages) return;
      if(q == null && search == null) return;
      if(q == '' && search == null) return;
      if((q && q.length < 3) && search == null) return;
      setLoading(true);
      try {
        let endpoint = `${endpointsPath.store}/q/products?page=${page}&limit=20&search=${search || q}&state=${state}&city=${city}`
        /*if(state.length < 1)endpoint = `${endpointsPath.store}?page=${page}&limit=20&search=${search}&city=${city}`
        else if(city.length < 1)endpoint = `${endpointsPath.store}?page=${page}&limit=20&search=${search}&state=${state}`
        else if(state.length < 1 && city.length < 1)endpoint = `${endpointsPath.store}?page=${page}&limit=20&search=${search}`*/
        const response = await requestHandler.get(
          endpoint
        );
  
        if (response.statusCode === 200) {
          const result = response.result.data;
  
          // Remove duplicate products based on _id
          const newProducts = result.products.filter(
            (product) => !products.some((existing) => existing._id === product._id)
          );
          
          setProducts((prev) => [...prev, ...newProducts]);
          const uniqueList = newProducts
          setProducts(uniqueList)
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };


  const getLocation = () => {
    let loc = localStorage.getItem('location')
    if(loc != null){
      loc = JSON.parse(loc)
      setState(loc.state)
      setCity(loc.city)
      setSelectedState(loc.state)
      setSelectedCity(loc.city)
    }
  }


  const searchHandle = (value) => {
    setSearch(value);
    if (value) {
      setLoading(true)
      setTimeout(() => {
        if(isSearchProducts) searchProducts();
      }, 5000); //5 secs
    }
  };

  useEffect(()=>{
    getLocation();
    searchProducts();
  },[search])

  useEffect(() => {
    if(isSearchProducts) searchProducts();
    if(search?.length < 3){
      setProducts([]);
      setProperties([]);
    }
  },[search])

  //SEO
  useEffect(() => {
    window.document.title = `Search - ${AppStrings.title}`;
 }, []);

 const redirectToSearch = (e) => {
  e.preventDefault();
  toast.success('Please wait...')
  let url =`/search?q=`+search
  router.push(url)
}

 const handleView = (productId, category, slug) => {
  toast.success("Please wait...");
  if(category === categoryName.vehicles) router.push(`/products/vehicle/${productId}/${slug}`, undefined, { shallow: true });
  else if(category === categoryName.motorcyclesTricycles) router.push(`/products/motorcycle-and-tricyle/${productId}/${slug}`, undefined, { shallow: true });
  else if(category === categoryName.realEstate) router.push(`/properties/${productId}/${slug}`, undefined, { shallow: true });
  else router.push(`/products/${productId}/${slug}`, undefined, { shallow: true });
};

  return (
    <div className="md:px-20 content-center">
    <div className="relative">
          <div className="flex mt-4 justify-center items-center">
            <form onSubmit={redirectToSearch} className="w-full">
          <TextInput id="search" 
          className="w-full" 
          type="text" 
          onChange={(e) => searchHandle(e.target.value)}
          rightIcon={Search}
          placeholder="Search for products and properties" 
          required />
          </form>
          <SearchFilterComponent/>
          </div>
          </div>

      <div className="relative ">
      {products.length > 0 || properties.length > 0? 
      <Card className="relative w-full mt-2">
        <div>
      {products.map((product) => (
        <div key={product._id} className="mb-4 hover:bg-gray-200 hover:p-2">
          <div className="flex" onClick={()=>handleView(product._id, product.category, product.slug)}>
       {/* <div className="w-34">
        <Image 
        width={300}
        height={300}
        src={formatImagePath(product.image)}
        alt="IMG"
        className="h-14 w-full rounded-lg object-cover p-1"
        />
        </div>*/}
        <div>
        <div className="font-bold">
          <span className="text-blue-500">{product.title}</span> in <span className="text-purple-950">{product.sub_category}</span>
          </div>
        <div>
        <div>{truncateText(product.description, 90)}</div>
        </div>
        <div className="flex text-xs font-bold">
          <MapPin size={15}/> {product.city}, {product.state}
        </div>
        </div>
        </div>
        </div>
    )
      )}
      
      </div>
      <Spinner loading={loading} />
      {showProducts && !loading && products.length < 1?
      'No result found. Sometimes, it might be because of your location. Consider updating your location' : ''}
      </Card> : ''}
      </div>
      </div>
  );
}
