"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import ProductsCardComponent from "../ProductsCard";
import Spinner from "../../../utils/loader";

const RelatedProductsComponent = (props) => {
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = {
    search: props.search || '',
    city: props.city || '',
    state: props.state || '', 
    country: props.country || '',
    category: props.category || '',
    sub_category: props.subCategory || '',
    description: props.description || '',
    condition: props.condition || '',
    brand: props.brand || '',
    page: props.page || 1,
    limit: props.limit || 20,
  };
  const queryString = new URLSearchParams(params).toString();
// Fetch products and remove duplicates
const getProducts = async (page = 1) => {
    if (loading || page > totalPages) return;
    setLoading(true);
    try {
      const response = await requestHandler.get(
        `${endpointsPath.store}?${queryString}`,
        false
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
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  // Infinite scroll handler
/*
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 200
    ) {
      if (!loading) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);*/


  return (
    <div className="container mx-auto p-2 md:p-4 mb-5">
     <h4 className="text-xl font-semibold mt-6 mb-5">Related Products</h4>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
            <ProductsCardComponent 
            key={product._id} 
            _id={product._id} 
            image={product.image} 
            category={product.category} 
            slug={product.slug}
            title={product.title}
            price={product.price}
            city={product.city}
            state={product.state}
            />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center mt-6">
          <Spinner loading={true}/>
        </div>
      )}
    </div>
  );
};

export default RelatedProductsComponent;
