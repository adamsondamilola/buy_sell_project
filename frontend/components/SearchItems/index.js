
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
import { SearchFilterComponent } from "../SearchFilter";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function SearchComponent() {
  const router = useRouter()

  const [state, setState] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [search, setSearch] = useState(null)


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
  };

  const redirectToSearch = (e) => {
    e.preventDefault();
    toast.success('Please wait...')
    let url =`/search?q=`+search
    router.push(url)
  }

  useEffect(()=>{
    getLocation()
  },[])

  return (
    <div className="px-2 content-center">

      <div className="relative ">
      <div className="flex justify-center items-center">
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

    </div>
  );
}
