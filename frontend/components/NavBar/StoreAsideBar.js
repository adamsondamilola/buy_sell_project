"use client";
import { Sidebar } from "flowbite-react";
import { Announcement, AnnouncementOutlined, Campaign, CampaignOutlined, Category, CategoryOutlined, CircleOutlined, Dashboard, InfoOutlined, KeyboardArrowRight, ListAltOutlined, LocationCity, Login, Logout, LogoutOutlined, Menu, Password, Person2, Person2Outlined, Person3, PersonOutline, PrivacyTip, PrivacyTipOutlined, Settings } from "@mui/icons-material";
import requestHandler from "../../utils/requestHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import nigeriaStates from "../../constants/NigeriaStates";
import { SearchComponent } from "../SearchItems";
import { formatImagePath } from "../../utils/formatImagePath";
import Image from "next/image";
import { truncateText } from "../../utils/truncateText";
import { stringToSLug } from "../../utils/stringToSlug";

const StoreAsideComponent = () => {
    const router = useRouter()
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
              setUserData(resp.result.data)
              setIsUserLoggedIn(true)
          }
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
  
      const [cats, setCats] = useState([])
      useEffect(()=>{
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
                getCatsData()
        //getCats()
      },[])
 
  
      useEffect(()=>{
      loggedInUser()
      getLocation()
      },[])

    return (
        <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        className="[&>div]:bg-transparent [&>div]:p-0"
      >
       <div className="w-full">
       <SearchComponent/>
       </div>
       <Sidebar.ItemGroup>
    <Sidebar.Collapse label='Categories' icon={CategoryOutlined} open>
                {
              cats.map((x) => {
                return (
                  <Sidebar.Collapse key={x._id} label={
                    <div className="flex gap-2">
<Image
                  width={20}
                  height={20}
                    className="rounded-t-lg object-cover"
                    src={formatImagePath(x?.image)}
                    alt=""
                  />
                  <span>{truncateText(x?.name, 20)}</span>
                    </div>
                  }>
                    
                 {/* <li onMouseEnter={() => filterMarketByState(x?.state?.id) } className='py-2 px-4' >
              <a href="#" className="hover:text-sky-600 dark:hover:text-primary-500">
                {x?.state?.name}
              </a>
            </li>*/}
            <Sidebar.Items>
                  <img
                    className="rounded-t-lg object-cover h-28 w-full"
                    src={formatImagePath(x?.image)}
                    alt="image"
                  />
            {x.subCategories.length > 0? 
          <div className="space-y-4 p-4">
          
          {
             x?.subCategories.map((y) => {
              return ( 
                <div className="flex" key={y._id}>
                  {/*<img
                    className="rounded-t-lg object-cover h-12 w-12"
                    src={`${y.image.replaceAll("\\", "/").replaceAll("C:/Users/adams/Desktop/Cpromoter_Store/cpromoter_store/Backend/uploads", "/api/files")}`}
                    alt="image"
                  />*/}
                <p className="ml-2 flex justify-center items-center">
            {x?.name === "Real Estate"? 
            <a href={`/properties/${stringToSLug(y?.name)}?search=${y?.name}&category=${x?.name}`} className="hover:text-sky-600 dark:hover:text-primary-500">
              {y?.name}
            </a>
            :
            <a href={`/products/${stringToSLug(y?.name)}?search=${y?.name}&category=${x?.name}`} className="hover:text-sky-600 dark:hover:text-primary-500">
              {y?.name}
            </a>
          }
          </p> 
          </div>
              )
            })
            
            }
            </div>
            : <div></div>
          }
            </Sidebar.Items>
            </Sidebar.Collapse>
                 
                )
              })
            }
                </Sidebar.Collapse>
                </Sidebar.ItemGroup>   
                

<Sidebar.ItemGroup>
<Sidebar.Item onClick={()=>sellBtnClick()} href="/sell" icon={CampaignOutlined}>
                Sell
                </Sidebar.Item>

{!isUserLoggedIn?
                <Sidebar.Items>
                <Sidebar.Item href="/login" icon={Login}>
                  Sign in
                </Sidebar.Item>
                <Sidebar.Item href="/signup" icon={PersonOutline}>
                  Sign up
                </Sidebar.Item>
                </Sidebar.Items>
                :
                <Sidebar.Items>
                  <Sidebar.Item href="/user/dashboard" icon={Dashboard}>
                  Dashboard
                </Sidebar.Item>
                  <Sidebar.Collapse label="My Posts" icon={Announcement}>            
                  <Sidebar.Item href="/user/products">
                              Products
                            </Sidebar.Item>
                            </Sidebar.Collapse>
                <Sidebar.Item href="/profile" icon={Person2Outlined}>
                  Profile
                </Sidebar.Item>
                <Sidebar.Item href="/profile/password-update" icon={Password}>
                                      Update Password
                                    </Sidebar.Item>
                <Sidebar.Item onClick={logOut} icon={Logout}>
                  Logout
                </Sidebar.Item>
                </Sidebar.Items>
                }
</Sidebar.ItemGroup>

<Sidebar.ItemGroup>
<Sidebar.Item href="/about" icon={InfoOutlined}>
                  About
                </Sidebar.Item>
                <Sidebar.Item href="/policy" icon={PrivacyTipOutlined}>
                  Privacy policy
                </Sidebar.Item>
                <Sidebar.Item href="/terms" icon={ListAltOutlined}>
                  Terms of use
                </Sidebar.Item>
              </Sidebar.ItemGroup>

                </Sidebar>
    )
}

export default StoreAsideComponent