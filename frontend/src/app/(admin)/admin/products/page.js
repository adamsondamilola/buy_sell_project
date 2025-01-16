'use client';
import AdminProductsListComponent from "../../../../../components/Admin/Products";
import ProductsListComponent from "../../../../../components/Admin/Products";
import endpointsPath from "../../../../../constants/EndpointsPath";

export default function AdminProductsList() {

  return (
    <AdminProductsListComponent title={'Products List'} endpoint={endpointsPath.productAdmin}/>
  );
}
