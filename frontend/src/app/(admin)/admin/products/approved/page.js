'use client';
import AdminProductsListComponent from "../../../../../../components/Admin/Products";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminApprovedProductsList() {

  return (
    <AdminProductsListComponent title={'Approved Products List'} endpoint={endpointsPath.productAdmin+"/approved"}/>
  );
}
