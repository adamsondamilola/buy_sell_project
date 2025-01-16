"use client";
import endpointsPath from "../../../constants/EndpointsPath";
import ProductsComponent from "../ProductsComponent";

const RecentProductsComponent = () => {

  return (
    <ProductsComponent.ProductComponent endpoint={endpointsPath.store} hasBearer={false}/>
  );
};

export default RecentProductsComponent;
