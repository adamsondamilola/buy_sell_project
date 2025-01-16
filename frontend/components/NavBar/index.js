
"use client";

import { Announcement, AnnouncementOutlined, Campaign, CampaignOutlined, Category, CategoryOutlined, CircleOutlined, InfoOutlined, KeyboardArrowRight, ListAltOutlined, LocationCity, Login, Logout, LogoutOutlined, Menu, Person2, Person2Outlined, Person3, PersonOutline, PrivacyTip, PrivacyTipOutlined, Settings } from "@mui/icons-material";
import { Navbar, Modal, Label, Select, Drawer, Sidebar, Dropdown, Avatar } from "flowbite-react";
import requestHandler from "../../utils/requestHandler";
import { useEffect, useState } from "react";
import LoginComponent from "../Auth/login";
import nigeriaStates from "../../constants/NigeriaStates";
import { Button } from "@mui/material";
import getGreeting from "../../utils/greetings";
import { toast } from "react-toastify";
import Link from "next/link";
import StoreAsideComponent from "./StoreAsideBar";
import Image from "next/image";
import AppImages from "../../constants/Images";
import { MapPin } from "lucide-react";
import { formatImagePath } from "../../utils/formatImagePath";

export function NavBarComponent() {

  const [openModal, setOpenModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [userData, setUserData] = useState({})
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [states, setStates] = useState(nigeriaStates)
  const [cities, setCities] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)


  const logOut = () => {
    let action = confirm('You are about to logout. Click Ok to proceed')
    if(action){
      localStorage.removeItem('token')
      location.href="/"  
    }
    else {
      toast.error('You are not logged out')
    }
  }

  const handleClose = () => {
    //alert("hey")
    setIsOpen(false)
  };

    const loggedInUser =  async () => {
        const resp = await requestHandler.get('user/profile', true);
        if(resp.statusCode === 200){
            setUserData(resp.result.data.user)
            setIsUserLoggedIn(true)
        }
    }

    const getCities = (state) => {
      const cities = states.filter(x => x.name == state)
      //alert(JSON.stringify(cities[0]['subdivision']))
      if(state == 'All' || state == '') setCities([])
      else setCities(cities[0]['subdivision']);
    }

    const setLocation = () => {
      const payload = {
        state: state,
        city: city
      }
      localStorage.setItem('location', JSON.stringify(payload))
      setOpenLocationModal(false)
    }

    const getLocation = () => {
      let loc = localStorage.getItem('location')
      if(loc != null){
        loc = JSON.parse(loc)
        setState(loc.state)
        setCity(loc.city)
      }
    }

    
    const sellBtnClick = () => {
        if(isUserLoggedIn) location.href='/sell'
        else setOpenModal(true)
    }

    const MobileDrawer = () => {
      const [cats, setCats] = useState([])
      const getCatsData = () => {
        //get data from local storage before hitting API
        try{
          const cats_ = localStorage.getItem('categories');
        if(cats_ != null){
        setCats(JSON.parse(cats_))
        /*
        setTimeout(() => {
          getCats();
        }, 5000); //5 secs
        */
        }
        else getCats();
        
        }
        catch(e){
          getCats()
          console.log(e)
        }
            }
        
            const getCats = async () => {
                
                    let resp = await requestHandler.get('sell/category', false);
                    if(resp.statusCode == 200){
                        setCats(resp.result.data)
                        localStorage.setItem("categories", JSON.stringify(resp.result.data))
                        //if(resp.responseBody.length > 20) setCats(resp.responseBody.slice(0, 20))
                            
                    }
                
                    console.log(resp)  
            }
        
            useEffect(()=>{
              getCatsData()
              //getCats()
            },[])
        
      return (
        <Drawer open={isOpen} onClose={()=>handleClose()}>
        <Drawer.Header title="Main" />
        <Image 
        className="bg-purple-950 p-1 rounded ml-2 mb-1" 
          width={100}
          height={50}
          alt="logo"
          src={AppImages.logo}
          />
        <Drawer.Items>
   <StoreAsideComponent/>
        </Drawer.Items>
      </Drawer>
      )
    }

    useEffect(()=>{
    loggedInUser()
    getLocation()
    },[])

  return (
    <Navbar className="bg-purple-950" fluid rounded>
      <Navbar.Brand>
        <div className="flex text-white"> <MapPin/> {state == ''? 'Select Location' : state == 'All'? 'All States,' : `${state}`} <Settings onClick={()=>setOpenLocationModal(true)}/></div>
        
      </Navbar.Brand>
      <div className="flex md:order-2">
        <div onClick={()=>sellBtnClick()} className="flex bg-transparent text-white justify-center font-bold items-center"><span className="text-md text-center">Sell</span> <Campaign className="ml-1 text-center text-2xl"/> </div>
      </div>
      {isUserLoggedIn? <div className="hidden md:block flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          //label={<PersonRounded/>}
          label={<Avatar className="h-6" alt="User settings" img={formatImagePath(userData.picture) || AppImages.avatar} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Hi, {userData.first_name}</span>
          </Dropdown.Header>
          <Dropdown.Item href="/user/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/profile">Profile</Dropdown.Item>
          <Dropdown.Item href="/profile/password-update">Password Update</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>logOut()}>Sign out</Dropdown.Item>
        </Dropdown>
      </div> : '' }
      <div className="text-white lg:hidden md:hidden" onClick={()=>{setIsOpen(true)}}> <Menu/> </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          <Image 
          width={100}
          height={50}
          alt="logo"
          src={AppImages.logo}
          />
        </Navbar.Link>
      </Navbar.Collapse>

      <Modal show={openLocationModal} onClose={() => setOpenLocationModal(false)}>
        <Modal.Body>
        <Modal.Header>Location </Modal.Header>
            <br/>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="w-full cols-1 mt-5">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="Select State/Province" />
      </div>
      <Select id="state"
      onChange={(e) => {setState(e.target.value); getCities(e.target.value) }}
      required>
        <option></option>
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
        <Label htmlFor="countries" value="City/LGA" />
      </div>
      <Select id="city" 
      onChange={(e) => {setCity(e.target.value) }}
      required>
      <option></option>
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
            <Button onClick={setLocation} variant="contained" color="primary" className="mt-5 w-full">
            Continue
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
        <Modal.Header> </Modal.Header>
            <br/>
            <LoginComponent redirectUrl={'/sell'}/>
        </Modal.Body>
      </Modal>

      <MobileDrawer />

    </Navbar>
  );
}
