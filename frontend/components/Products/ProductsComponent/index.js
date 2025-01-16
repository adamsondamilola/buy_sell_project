"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import requestHandler from "../../../utils/requestHandler";
import ProductsCardComponent from "../ProductsCard";
import Spinner from "../../../utils/loader";
import LoginRedirectComponent from "../../Auth/LoginRedirect";
import { useRouter } from "next/navigation";

const ProductComponent = (props) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const uniqueIds = new Set();
  const router = useRouter();
  const params = {
    search: props.search || '',
    city: props.city || selectedCity || '',
    state: props.state || selectedState || '', 
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
const getProducts = async (page = 1) => {
    if (loading || page > totalPages) return;
    setLoading(true);
    try {
      let endpoint = `${props.endpoint}?${queryString}`;

      const response = await requestHandler.get(
        endpoint,
        props.hasBearer
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
      setProductsLoaded(true);
    }
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  // Infinite scroll handler
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
  }, [handleScroll]);

  useEffect(()=>{
    const getLocation = () => {
      let loc = localStorage.getItem('location')
      if(loc != null){
        loc = JSON.parse(loc)
        setSelectedState(loc.state)
        setSelectedCity(loc.city)
      }
    }
    getLocation();
  },[])

  // Handlers
  const handleView = (productId, category, slug) => {
    toast.success("Please wait...");
    router.push(`/products/${category}/${productId}/${slug}`);
  };


  return (
    <div className="container mx-auto p-2 md:p-4 mb-5">
     {/*<h4 className="text-xl font-semibold py-2">Products</h4>*/}
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

      {/* No Data */}
      {productsLoaded && products.length < 1 && (
        <div className="text-center mt-6">
          No result found. Sometimes, it might be because of your location. Consider updating your location
        </div>
      )}
    </div>
  );
};


const Products10Component = (props) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const uniqueIds = new Set();
  const router = useRouter();
  const params = {
    search: props.search || '',
    city: props.city || selectedCity || '',
    state: props.state || selectedState || '', 
    country: props.country || '',
    category: props.category || '',
    sub_category: props.subCategory || '',
    description: props.description || '',
    condition: props.condition || '',
    brand: props.brand || '',
    page: props.page || 1,
    limit: props.limit || 10,
  };
  const queryString = new URLSearchParams(params).toString();
// Fetch products and remove duplicates
const getProducts = async (page = 1) => {
    if (loading || page > totalPages) return;
    setLoading(true);
    try {
      let endpoint = `${props.endpoint}?${queryString}`;

      const response = await requestHandler.get(
        endpoint,
        props.hasBearer
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
      setProductsLoaded(true)
    }
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  useEffect(()=>{
    const getLocation = () => {
      let loc = localStorage.getItem('location')
      if(loc != null){
        loc = JSON.parse(loc)
        setSelectedState(loc.state)
        setSelectedCity(loc.city)
      }
    }
    getLocation();
  },[])

  return (
    <div className="container mx-auto p-2 md:p-4 mb-5">
     {/*<h4 className="text-xl font-semibold py-2">Products</h4>*/}
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* No Data */}
      {productsLoaded && products.length < 1 && (
        <div className="text-center mt-6">
          No result found. Sometimes, it might be because of your location. Consider updating your location
        </div>
      )}
    </div>
  );
};

const ProductsFavComponent = (props) => {
    const [favorites, setFavorites] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const uniqueIds = new Set();
  // Fetch products and remove duplicates
  const getProducts = async (page = 1) => {
      if (loading || page > totalPages) return;
      setLoading(true);
      try {
        const response = await requestHandler.get(
          `${props.endpoint}?page=${page}&limit=20`,
          props.hasBearer
        );
  
        if (response.statusCode === 200) {
          const result = response.result.data;
  
          // Remove duplicate products based on _id
          const newProducts = result.favorites.filter(
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

    useEffect(()=>{
      LoginRedirectComponent('/favorites');
    },[])
  
    useEffect(() => {
      getProducts(currentPage);
    }, [currentPage]);
  
    // Infinite scroll handler
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
    }, [handleScroll]);
  
     // Toggle favorite status for a product
     const toggleFavorite = (productId) => {
      setFavorites((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    };
  
    // Handlers
    const handleView = (productId, category, slug) => {
      toast.success("Please wait...");
      router.push(`/products/${category}/${productId}/${slug}`);
    };
  
  
    return (
      <div className="container mx-auto p-2 md:p-4 mb-5">
       
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
              <ProductsCardComponent 
              fav={true}
              key={product.product_id._id} 
              _id={product.product_id._id} 
              image={product.product_id.image} 
              category={product.product_id.category} 
              slug={product.product_id.slug}
              title={product.product_id.title}
              price={product.product_id.price}
              city={product.product_id.city}
              state={product.product_id.state}
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
  
  export default {ProductComponent, Products10Component, ProductsFavComponent};
  