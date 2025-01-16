
"use client";

import { Avatar, Drawer, Dropdown, Navbar } from "flowbite-react";
import AppImages from "../../constants/Images";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PersonRounded } from "@mui/icons-material";
import requestHandler from "../../utils/requestHandler";
import AsideComponent from "./aside";
import endpointsPath from "../../constants/EndpointsPath";
import AdminAsideComponent from "./adminAside";

export function AdminNavBarComponent() {
  const [userData, setUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const router = useRouter()
  
  useEffect(() => {
    const loggedInUser =  async () => { 
      const resp = await requestHandler.get(endpointsPath.profile, true);
      if(resp.statusCode === 200){
          setUserData(resp.result.data)
          if(resp.result.data.user.role != "Admin"){
            router.push("/login")
          }
      }
      else {
        router.push("/login")
      }
  }
  loggedInUser();
  },[])

  const logOut = () => {
    localStorage.removeItem('token')
    router.push("/")
  }

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
      <div className="bg-purple-950 rounded-lg p-1"><img src={AppImages.logo} className="mr-3 h-6 sm:h-9" alt="Logo" /></div>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          //label={<PersonRounded/>}
          label={<Avatar alt="User settings" img={AppImages.avatar} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{userData.firstname} {userData.lastname}</span>
            <span className="block truncate text-sm font-medium">{userData.email}</span>
          </Dropdown.Header>
          <Dropdown.Item href="/admin">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/profile">Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>logOut()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle onClick={() => setIsOpen(true)}/>
      </div>

<Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title={<div className="bg-purple-950 rounded-lg p-1"><img src={AppImages.logo} width={'100'}/></div>} titleIcon={() => <></>} />
        <Drawer.Items>
          <AdminAsideComponent/>
        </Drawer.Items>
      </Drawer>

    </Navbar>
  );
}
