"use client";

import { useParams } from "next/navigation";
import endpointsPath from "../../../constants/EndpointsPath";
import ProductsComponent from "../ProductsComponent";

const ProductsByUsernameAllComponent = () => {
const params = useParams();
  return (
    <ProductsComponent.ProductComponent endpoint={`${endpointsPath.store}/${params?.username}/get-products-by-username`} hasBearer={false}/>
  );
};

export default ProductsByUsernameAllComponent;
