
"use client";

import { Avatar, Drawer, Dropdown, Navbar } from "flowbite-react";
import AppImages from "../../constants/Images";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PersonRounded } from "@mui/icons-material";
import requestHandler from "../../utils/requestHandler";
import AsideComponent from "./aside";
import endpointsPath from "../../constants/EndpointsPath";

export function DashboardNavBarComponent() {
  const [userData, setUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const router = useRouter()
  
  useEffect(() => {
    const loggedInUser =  async () => { 
      const resp = await requestHandler.get(endpointsPath.profile, true);
      if(resp.statusCode === 200){
          setUserData(resp.result.data)
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
        <img src={AppImages.logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
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
          <Dropdown.Item href="/user/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/profile">Profile</Dropdown.Item>
          <Dropdown.Item href="/profile/password-update">Update Password</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>logOut()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle onClick={() => setIsOpen(true)}/>
      </div>
      {/*<Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>*/}

<Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title={<img src={AppImages.logo} width={'100'}/>} titleIcon={() => <></>} />
        <Drawer.Items>
          <AsideComponent/>
        </Drawer.Items>
      </Drawer>


    </Navbar>
  );
}
