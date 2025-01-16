
"use client";

import { Cancel, Search, Tune } from "@mui/icons-material";
import { Card, Checkbox, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiMail } from "react-icons/hi";
import nigeriaStates from "../../constants/NigeriaStates";
import { Button } from "@mui/material";
import endpointsPath from "../../constants/EndpointsPath";
import requestHandler from "../../utils/requestHandler";
import Link from "next/link";

export function SearchFilterComponent() {
  const [openModal, setOpenModal] = useState(false);

  const [state, setState] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [states, setStates] = useState(nigeriaStates)
  const [cities, setCities] = useState([])

  const [isSearchProducts, setIsSearchProducts] = useState(true);
  const [isSearchProperties, setIsSearchProperties] = useState(true);
  const [isSearchSellers, setIsSearchSellers] = useState(false);
  
  const [isNew, setIsNew] = useState(true);
  const [isRefurbished, setIsRefurbished] = useState(true);
  const [isForeignUsed, setIsForeignUsed] = useState(true);
  const [isNigeriaUsed, setIsNigeriaUsed] = useState(true);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(true);
  const [isUnVerifiedSeller, setIsUnVerifiedSeller] = useState(true);

  //properties
  const [isTolet, setIsTolet] = useState(true);
  const [isShortlet, setIsShortlet] = useState(true);
  const [isForSale, setIsForSale] = useState(true);
  const [isForLease, setIsForLease] = useState(true);
  const [isApartment, setIsApartment] = useState(true);
  const [isShop, setIsShop] = useState(true);
  const [isOfficeSpace, setIsOfficeSpace] = useState(true);
  const [isSemiDetachedDuplex, setIsSemiDetachedDuplex] = useState(true);
  const [isDetachedDuplex, setIsDetachedDuplex] = useState(true);
  const [isDetachedBungalow, setIsDetachedBungalow] = useState(true);
  const [isCoWorkingSpace, setIsCoWorkingSpace] = useState(true);
  const [isCommercialProperty, setIsCommercialProperty] = useState(true);
  const [isSelfContain, setIsSelfContain] = useState(true);
  const [isMiniFlat, setIsMiniFlat] = useState(true);
  const [isWarehouse, setIsWarehouse] = useState(true);
  const [isLand, setIsLand] = useState(true);

  const [products, setProducts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(null)

  const handleFilterResultSettings = () => {
    const payload = {
      state: state,
      city: city
    }
    const location = {
      state: state,
      city: city
    }
    localStorage.setItem('location', JSON.stringify(location));

    localStorage.setItem('filter_settings', JSON.stringify(payload))
    setOpenModal(false)
  }

  const setLocation = () => {
    setSelectedCity(city)
    setSelectedState(state)
    const payload = {
      state: state,
      city: city
    }
    localStorage.setItem('location', JSON.stringify(payload))
    //setOpenLocationModal(false)
  }

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


  const getCities = (state) => {
    const cities = states.filter(x => x.name == state)
    //alert(JSON.stringify(cities[0]['subdivision']))
    if(state == 'All' || state == '') setCities([])
    else setCities(cities[0]['subdivision']);
  }

  const searchHandle = (value) => {
    setSearch(value);
    /*if (value) {
      if(isSearchProducts) searchProducts();
      if(isSearchProperties) searchProperties();
    }*/
  };

  useEffect(()=>{
    getLocation()
  },[])


  const FilterSettings = () => {
    return <div> 

      <div>
      <div>Location: {selectedState == ''? '' : selectedState == 'All'? 'All States,' : `${selectedState},`} {selectedCity == '' || selectedCity == 'All'? '' : `${selectedCity}`}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="w-full cols-1 mt-5">
      <div className="mb-2 block">
        <Label htmlFor="state" value="Select State/Province" />
      </div>
      <Select id="state"
      onChange={(e) => {setState(e.target.value); setSelectedState(e.target.value); setSelectedCity(''); getCities(e.target.value); }}
      required>
        <option>{selectedState}</option>
        <option>All</option>
        {
          states.map((x) => {
            return (
              <option key={x.name}>{x.name}</option>
            )
          })
        }
      </Select>
    </div>

    <div className="w-full mt-5">
      <div className="mb-2 block">
        <Label htmlFor="city" value="City/LGA" />
      </div>
      <Select id="city" 
      onChange={(e) => {{setCity(e.target.value); setSelectedCity(e.target.value); } }}
      required>
      <option>{selectedCity}</option>
        <option>All</option>
        {
          cities.map((x) => {
            return (
              <option key={x}>{x}</option>
            )
          })
        }
      </Select>
    </div>
    </div>
    </div>

    <div className=" mt-5">
      <div className="mb-5">Search Type:</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isSearchProducts} onChange={()=>setIsSearchProducts(isSearchProducts? false : true)} />
        <Label className="flex">
          Search Products
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isSearchProperties} onChange={()=>setIsSearchProperties(isSearchProperties? false : true)} />
        <Label className="flex">
          Search Properties
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isSearchSellers} onChange={()=>setIsSearchSellers(isSearchSellers? false : true)} />
        <Label className="flex">
          Search Sellers
        </Label>
      </div>
      </div>
    </div>

    {/*<div className="flex flex-col mt-5">
      <div className="mb-5">Seller/Agent Type:</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isVerifiedSeller} onChange={()=>setIsVerifiedSeller(isVerifiedSeller? false : true)} />
        <Label className="flex">
          Verified
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isUnVerifiedSeller} onChange={()=>setIsUnVerifiedSeller(isUnVerifiedSeller? false : true)} />
        <Label className="flex">
          Unverified
        </Label>
      </div>
      </div>
    </div>*/}

    <div style={{display: isSearchProducts? 'flex' : 'none'}} className="flex flex-col mt-5">
      <div className="mb-5">Product Condition:</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isNew} onChange={()=>setIsNew(isNew? false : true)} />
        <Label className="flex">
          New
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isRefurbished} onChange={()=>setIsRefurbished(isNew? false : true)} />
        <Label className="flex">
        Refurbished
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isForeignUsed} onChange={()=>setIsForeignUsed(isForeignUsed? false : true)} />
        <Label className="flex">
          Foreign Used
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isNigeriaUsed} onChange={()=>setIsNigeriaUsed(isNigeriaUsed? false : true)} />
        <Label className="flex">
          Nigeria Used
        </Label>
      </div>
      </div>
    </div>


    <div style={{display: isSearchProperties? 'flex' : 'none'}} className="flex flex-col mt-5">
      <div className="mb-5">Property Type:</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isApartment} onChange={()=>setIsApartment(isApartment? false : true)} />
        <Label className="flex">
          Flat & Apartment
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isLand} onChange={()=>setIsLand(isLand? false : true)} />
        <Label className="flex">
          Land
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isSelfContain} onChange={()=>setIsSelfContain(isSelfContain? false : true)} />
        <Label className="flex">
          Self Contain
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isMiniFlat} onChange={()=>setIsMiniFlat(isMiniFlat? false : true)} />
        <Label className="flex">
          Mini Flat
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isShop} onChange={()=>setIsShop(isShop? false : true)} />
        <Label className="flex">
          Shop
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isOfficeSpace} onChange={()=>setIsOfficeSpace(isOfficeSpace? false : true)} />
        <Label className="flex">
          Office Space
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isSemiDetachedDuplex} onChange={()=>setIsSemiDetachedDuplex(isSemiDetachedDuplex? false : true)} />
        <Label className="flex">
        Semi Detached Duplex
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isDetachedDuplex} onChange={()=>setIsDetachedDuplex(isDetachedDuplex? false : true)} />
        <Label className="flex">
        Detached Duplex
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isDetachedBungalow} onChange={()=>setIsDetachedBungalow(isDetachedBungalow? false : true)} />
        <Label className="flex">
        Detached Bungalow
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isCoWorkingSpace} onChange={()=>setIsCoWorkingSpace(isCoWorkingSpace? false : true)} />
        <Label className="flex">
        Co-Working Space
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isCommercialProperty} onChange={()=>setIsCommercialProperty(isCommercialProperty? false : true)} />
        <Label className="flex">
        Commercial Property
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isWarehouse} onChange={()=>setIsWarehouse(isWarehouse? false : true)} />
        <Label className="flex">
        Ware house
        </Label>
      </div>
      </div>
    </div>

    <div style={{display: isSearchProperties? 'flex' : 'none'}} className="flex flex-col mt-5">
      <div className="mb-5">Property For:</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isTolet} onChange={()=>setIsTolet(isTolet? false : true)} />
        <Label className="flex">
          Rent
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isShortlet} onChange={()=>setIsShortlet(isShortlet? false : true)} />
        <Label className="flex">
          Shortlet
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isForSale} onChange={()=>setIsForSale(isForSale? false : true)} />
        <Label className="flex">
          Sale
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="text-purple-950" checked={isForLease} onChange={()=>setIsForLease(isForLease? false : true)} />
        <Label className="flex">
          Lease
        </Label>
      </div>
      </div>
    </div>

    <Button onClick={handleFilterResultSettings} variant="contained" color="primary" className="bg-purple-950 mt-5 w-full">
            Continue
          </Button>

  </div>
  }

  return (
    <div className="px-2 content-center">
      <div className="relative ">
      <div onClick={()=>setOpenModal(true)} className="text-2xl rounded-lg w-10 h-10 bg-purple-950 text-white flex justify-center items-center"> <Tune/> </div>
      {/*products.length > 0 || properties.length > 0? 
      <Card className="absolute w-full overflow-y-scroll mt-2 z-30">
        <Button onClick={()=>{setProducts([]); setProperties([])}} className="text-red-500 absolute top-0 right-0">
          <Cancel/>
        </Button>
      {products.map((product) => (
        <Link key={product._id} href={`/search?q=${product.title}`}>
        <span className="text-blue-500">{product.title}</span> in <span className="text-purple-950">{product.sub_category}</span>
        </Link>
    )
      )}
      {properties.map((property) => (
        <Link key={property._id} href={`/search?q=${property.title}`}>
        <span className="text-blue-500">{property.title}</span> in <span className="text-purple-950">{property.sub_category}</span>
        </Link>
    )
      )}
      </Card> : ''*/}
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
        <Modal.Header>Search Filter Settings </Modal.Header>
            <br/>
            <FilterSettings/>
        </Modal.Body>
      </Modal>

    </div>
  );
}
