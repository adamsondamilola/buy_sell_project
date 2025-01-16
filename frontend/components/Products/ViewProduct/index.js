import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import formatNumberToCurrency from "../../../utils/numberToMoney";
import requestHandler from "../../../utils/requestHandler";
import { formatImagePath } from "../../../utils/formatImagePath";
import { Card } from "flowbite-react";
import endpointsPath from "../../../constants/EndpointsPath";
import dateTimeToWord from "../../../utils/dateTimeToWord";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import PosterShortDetailsCardComponent from "../../User/PosterShortDetailsCard";
import Link from "next/link";
import Head from "next/head";
import AppStrings from "../../../constants/Strings";
import RelatedProductsComponent from "../RelatedProducts";
import AppImages from "../../../constants/Images";

const ViewProductComponent = (props) => {
  const id = props.id
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Skip if the ID is not available yet

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await requestHandler.get(`${endpointsPath.store}/${id}`, true);
        response.statusCode === 200 ? setProduct(response.result.data[0]) : setProduct(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Update the document title
    window.document.title = `${product?.title || "Product Details"} - ${AppStrings.title}`;
  
    // Update the meta description
    const metaDescription = window.document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        product?.description?.substring(0, 160) || "View detailed information about this product."
      );
    } else {
      const newMetaDescription = window.document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content =
        product?.description?.substring(0, 160) || "View detailed information about this product.";
      window.document.head.appendChild(newMetaDescription);
    }
  
    // Update the meta image (Open Graph image)
    const metaImage = window.document.querySelector('meta[property="og:image"]');
    if (metaImage) {
      metaImage.setAttribute("content", formatImagePath(product?.image) || AppImages.logo);
    } else {
      const newMetaImage = window.document.createElement("meta");
      newMetaImage.setAttribute("property", "og:image");
      newMetaImage.content = formatImagePath(product?.image) || AppImages.logo;
      window.document.head.appendChild(newMetaImage);
    }
  }, [product]);
  
  

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p>Product not found.</p>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700 font-semibold mt-4"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const productDetails = product?.details ? JSON.parse(product.details) : {};
  

  return (
    <>
    {/* SEO Metadata */}
    <Head>
        <title>{product?.title || "Product Details"} - {AppStrings.title}</title>
        <meta
          name="description"
          content={product?.description?.substring(0, 160) || "View detailed information about this product."}
        />
        <meta name="keywords" content={`${product?.category}, ${product?.sub_category}, ${product?.brand}`} />
        <meta name="author" content={product?.user_id?.username || "Unknown Seller"} />
        <meta property="og:title" content={product?.title || "Product Details"} />
        <meta
          property="og:description"
          content={product?.description?.substring(0, 160) || "Check out this amazing product on our store."}
        />
        <meta property="og:image" content={formatImagePath(product.image)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`${process.env.publicUrl}/products/${id}/${product.slug}`} />
      </Head>
    <div className="max-w-5xl mx-auto lg:py-10 py-10">
      {/* Header */}
      <div className="flex text-sm">
      <Link href={`/`}>
            Products
            </Link> <ChevronRight size={20}/>
            <Link href={`/products?search=q&category=${product.category}`}>
            {product.category}
            </Link> <ChevronRight size={20}/>
            <Link href={`/products?search=q&category=${product.category}&sub_category=${product.sub_category}`}>
            {product.sub_category}
            </Link>
            </div>
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        {/* Images Section */}
        <div className="space-y-4 col-span-2">
          <img
            src={formatImagePath(currentImage === null? product.image : currentImage)} // Replace backslashes for compatibility
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                onClick={()=>setCurrentImage(image)}
                key={index}
                src={formatImagePath(image)}
                alt={`Product Image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md shadow-md"
              />
            ))}
          </div>

          <Card>
          <h4 className="text-4xl font-semibold">{formatNumberToCurrency(product.price)}</h4>
          <ul className="space-y-2">
            <li>
              <strong className="text-sm">Brand:</strong> {product.brand}
            </li>
            <li>
              <strong className="text-sm">Condition:</strong> {product.condition}
            </li>
            {/*<li>
              <strong className="text-sm">Price:</strong> {formatNumberToCurrency(product.price)}
            </li>
            <li>
              <strong className="text-sm">Stock:</strong> {product.stock} available
            </li>
            <li>
              <strong className="text-sm">Status:</strong> <StatusComponent status={product.status}/>
            </li>
            */}
            <li>
              <span className="flex gap-1"><Clock size={16} className="mt-1"/> {dateTimeToWord(product.createdAt)}</span>
            </li>
            <li>
              <span className="flex gap-1"><MapPin size={16} className="mt-1"/> {product.city}, {product.state}, {product.country}</span>
            </li>
          </ul>
          </Card>

          {/* Additional Details */}
      <Card className="mt-5">
      <div className="">
        <h4 className="text-xl font-semibold">Description</h4>
        <p className="mt-4">{product.description}</p>
      </div>
      </Card>
        </div>

        {/* Details Section */}
        <div className="flex flex-col mt-5 md:mt-0">
            
            {/* Poster/Seller Details */}
          <PosterShortDetailsCardComponent 
          picture={formatImagePath(product?.user_id?.picture)} 
          shop_name={product?.user_id?.shop_name}
          rating={product?.user_id?.rating}
          createdAt={product?.user_id?.createdAt}
          userId={product?.user_id?._id}
          username={product?.user_id?.username}
          phone={product?.user_id?.phone}
          whatsapp={product?.user_id?.whatsapp?.substring(1)}
          />

          {/* Parsed Product Details */}
          <Card className="mt-5">
          <h4 className="text-xl font-semibold mt-6">Other Details</h4>
          <ul className="space-y-2 mt-2">
            {Object.entries(productDetails).map(([key, value]) => (
              <li key={key}>
                <strong className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
          </Card>
          

        </div>
          </div>

<RelatedProductsComponent 
search={product.sub_category}
city={product.city} 
country={product.country} 
category={product.category}
brand={product.brand}
condition={product.condition}
sub_category={product.sub_category}
/>
      
    </div>
    </>
  );
};

export default ViewProductComponent;
