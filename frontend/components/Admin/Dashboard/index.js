"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import requestHandler from "../../../utils/requestHandler";
import { useRouter } from "next/navigation";
import endpointsPath from "../../../constants/EndpointsPath";

export default function DashboardAdminComponent() {
  const [properties, setProperties] = useState([]);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [propertiesApprovedCount, setPropertiesApprovedCount] = useState(0);
  const [propertiesDeclineCount, setPropertiesDeclineCount] = useState(0);
  const [propertiesPendingCount, setPropertiesPendingCount] = useState(0);

   const [products, setProducts] = useState([]);
   const [productsCount, setProductsCount] = useState(0);
   const [productsApprovedCount, setProductsApprovedCount] = useState(0);
  const [productsDeclineCount, setProductsDeclineCount] = useState(0);
  const [productsPendingCount, setProductsPendingCount] = useState(0);

  const [usersCount, setUsersCount] = useState(0)
  const [usersActiveCount, setUsersActiveCount] = useState(0)
  const [usersBlockedCount, setUsersBlockedCount] = useState(0)
  const [usersDeletedCount, setUsersDeletedCount] = useState(0)

  const [sellersCount, setSellersCount] = useState(0)

  const [categoriesCount, setCategoriesCount] = useState(0)

  const [brandsCount, setBrandsCount] = useState(0)

      useEffect(()=>{
        const getProducts = async () => {
            const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/products', true);
            if(response.statusCode === 200){
                let result = response.result.data
                setProductsCount(result.totalProducts)
                setProductsApprovedCount(result.approvedProducts)
                setProductsDeclineCount(result.declinedProducts)
                setProductsPendingCount(result.pendingProducts)
            }
        }
        getProducts()
    }, [])


  useEffect(() => {
    const getProperties = async () => {
      const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/properties', true);
      if(response.statusCode === 200){
        let result = response.result.data
        setPropertiesCount(result.totalProperties)
        setPropertiesApprovedCount(result.approvedProperties)
                setPropertiesDeclineCount(result.declinedProperties)
                setPropertiesPendingCount(result.pendingProperties)
    }
    }
    getProperties();
  }, []);

  useEffect(() => {
   const getUsers = async () => {
     const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/users', true);
     if(response.statusCode === 200){
       let result = response.result.data
       setUsersCount(result.totalUsers)
       setUsersBlockedCount(result.blockedUsers)
               setUsersActiveCount(result.activeUsers)
               setUsersDeletedCount(result.deletedUsers)
   }
   }
   getUsers();
 }, []);

 useEffect(() => {
   const getShops = async () => {
     const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/shops', true);
     if(response.statusCode === 200){
       let result = response.result.data
       setSellersCount(result.totalShops)
   }
   }
   getShops();
 }, []);

 useEffect(() => {
   const getCategories = async () => {
     const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/categories', true);
     if(response.statusCode === 200){
       let result = response.result.data
       setCategoriesCount(result.totalCategories)
   }
   }
   getCategories();
 }, []);

 
 useEffect(() => {
   const getBrands = async () => {
     const response = await requestHandler.get(endpointsPath.statisticsAdmin+'/brands', true);
     if(response.statusCode === 200){
       let result = response.result.data
       setBrandsCount(result.totalBrands)
   }
   }
   getBrands();
 }, []);

 const ProductsStats = () => {
   return (
      <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">    
    <h4 className="text-lg font-bold text-gray-400 dark:text-gray-500">Products Statistics</h4>
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
    <Link shallow href={'/admin/products'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          All
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {productsCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
    <Link shallow href={'/admin/products/approved'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Approved
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {productsApprovedCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
    <Link shallow href={'/admin/products/rejected'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Rejected
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {productsDeclineCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
    <Link shallow href={'/admin/products/pending'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Pending
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {productsPendingCount}
       </p>
       </div>
       </Link>
    </div>
 </div>
 </div>
   )
 }

 const UsersStats = () => {
   return (
      <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">    
    <h4 className="text-lg font-bold text-gray-400 dark:text-gray-500">Users Statistics</h4>
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
    <div className="flex items-center justify-center h-24 rounded bg-blue-50 dark:bg-gray-800">
    <Link shallow href={'/admin/users'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          All
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {usersCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-blue-50 dark:bg-gray-800">
    <Link shallow href={'#'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Active
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {usersActiveCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-blue-50 dark:bg-gray-800">
    <Link shallow href={'/admin/users/blocked'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Blocked
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {usersBlockedCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-blue-50 dark:bg-gray-800">
    <Link shallow href={'#'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Deleted
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {usersDeletedCount}
       </p>
       </div>
       </Link>
    </div>
 </div>
 </div>
   )
 }

 const OtherStats = () => {
   return (
      <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">    
    <h4 className="text-lg font-bold text-gray-400 dark:text-gray-500">Other Statistics</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div className="flex items-center justify-center h-24 rounded bg-green-50 dark:bg-gray-800">
    <Link shallow href={'/admin/users/shops'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Sellers
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {sellersCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-green-50 dark:bg-gray-800">
    <Link shallow href={'/admin/setting/categories'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Categories
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {categoriesCount}
       </p>
       </div>
       </Link>
    </div>
    <div className="flex items-center justify-center h-24 rounded bg-green-50 dark:bg-gray-800">
    <Link shallow href={'/admin/setting/brands'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          Brands
       </p>
       <p className="p-4 text-xl text-gray-400 dark:text-gray-500">
          {brandsCount}
       </p>
       </div>
       </Link>
    </div>
 </div>
 </div>
   )
 }


  return (
   <div>
<ProductsStats/>
<UsersStats/>
<OtherStats/>   
 </div>
  );
}