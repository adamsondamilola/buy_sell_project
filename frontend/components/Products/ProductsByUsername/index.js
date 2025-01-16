"use client";

import { useParams } from "next/navigation";
import endpointsPath from "../../../constants/EndpointsPath";
import ProductsComponent from "../ProductsComponent";

const ProductsByUsernameComponent = () => {
const params = useParams();
  return (
    <ProductsComponent.Products10Component endpoint={`${endpointsPath.store}/${params?.username}/get-products-by-username`} hasBearer={false}/>
  );
};

export default ProductsByUsernameComponent;
