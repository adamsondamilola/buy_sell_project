"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import formatNumberToCurrency from "../../../../utils/numberToMoney";
import requestHandler from "../../../../utils/requestHandler";
import endpointsPath from "../../../../constants/EndpointsPath";
import { formatImagePath } from "../../../../utils/formatImagePath";
import { Card } from "flowbite-react";
import dateTimeToString from "../../../../utils/dateTimeToString";
import StatusComponent from "../../../Status";

const ViewProductUserComponent = (props) => {
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
        const response = await requestHandler.get(`${endpointsPath.product}/${id}`, true);
        response.statusCode === 200 ? setProduct(response.result.data) : setProduct(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
    <div className="max-w-5xl mx-auto lg:py-10 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
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
          {/* Additional Details */}
      <Card className="mt-5">
      <div className="">
        <h4 className="text-xl font-semibold">Description</h4>
        <p className="mt-4">{product.description}</p>
      </div>
      </Card>
        </div>

        {/* Details Section */}
        <div>
            <Card>
          <h4 className="text-xl font-semibold mb-4">Product Details</h4>
          <ul className="space-y-2">
            <li>
              <strong className="text-sm">Category:</strong> {product.category}
            </li>
            <li>
              <strong className="text-sm">Sub-category:</strong> {product.sub_category}
            </li>
            <li>
              <strong className="text-sm">Brand:</strong> {product.brand}
            </li>
            <li>
              <strong className="text-sm">Condition:</strong> {product.condition}
            </li>
            <li>
              <strong className="text-sm">Price:</strong> {formatNumberToCurrency(product.price)}
            </li>
            <li>
              <strong className="text-sm">Stock:</strong> {product.stock} available
            </li>
            <li>
              <strong className="text-sm">Status:</strong> <StatusComponent status={product.status}/>
            </li>
            <li>
              <strong className="text-sm">Date Added:</strong> {dateTimeToString(product.createdAt)}
            </li>
          </ul>
          </Card>

          {/* Parsed Product Details */}
          <Card className="mt-5">
          <h4 className="text-xl font-semibold mt-6">Specifications</h4>
          <ul className="space-y-2 mt-2">
            {Object.entries(productDetails).map(([key, value]) => (
              <li key={key}>
                <strong className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
          </Card>

          {/* Location Details */}
          <Card className="mt-5">
          <h4 className="text-xl font-semibold mt-6">Location</h4>
          <p>
            {product.city}, {product.state}, {product.country}
          </p>
          </Card>

        </div>
      </div>

      
    </div>
  );
};

export default ViewProductUserComponent;
