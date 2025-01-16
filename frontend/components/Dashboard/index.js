"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppStrings from "../../constants/Strings";
import requestHandler from "../../utils/requestHandler";
import { useRouter } from "next/navigation";
import endpointsPath from "../../constants/EndpointsPath";
import SellComponent from "../User/Sell";

export default function DashboardComponent() {
  const [products, setProducts] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const router = useRouter();
    
      useEffect(()=>{
        const getProducts = async () => {
            const response = await requestHandler.get(endpointsPath.product, true);
            if(response.statusCode === 200){
                let result = response.result.data
                setProducts(result.products)
                setProductsCount(result.totalProducts)
                localStorage.setItem('my_products', JSON.stringify(result.products))
            }
        }
        try{
            const data = localStorage.getItem('my_products');
          if(data != null){
            const result = JSON.parse(data);
            setProducts(result)
            setProductsCount(result.length)
          }
          setTimeout(() => {
            getProducts();
          }, 5000); //5 secs
          
          
          }
          catch(e){
            getProducts()
            console.log(e)
          } 
        //getProducts()
    }, [])


  return (
    <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
    
    <div className="grid grid-cols-1 gap-4 mb-4">
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
    <Link shallow href={'/user/products'}>
       <div className="flex flex-row justify-between">
       <p className="p-4 text-2xl text-gray-400 dark:text-gray-500">
          Products
       </p>
       <p className="p-4 text-2xl text-gray-400 dark:text-gray-500">
          {productsCount}
       </p>
       </div>
       </Link>
    </div>
 </div>

       <SellComponent />

 </div>
  );
}