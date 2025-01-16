'use client';
import AdminProductsListComponent from "../../../../../../components/Admin/Products";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminPendingProductsList() {

  return (
    <AdminProductsListComponent title={'Pending Products List'} endpoint={endpointsPath.productAdmin+"/pending"}/>
  );
}
