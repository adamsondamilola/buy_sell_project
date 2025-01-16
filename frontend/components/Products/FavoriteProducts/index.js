"use client";
import endpointsPath from "../../../constants/EndpointsPath";
import ProductsComponent from "../ProductsComponent";

const FavoriteProductsComponent = () => {

  return (
    <ProductsComponent.ProductsFavComponent endpoint={endpointsPath.user+'/favorite'} hasBearer={true}/>
  );
};

export default FavoriteProductsComponent;
