'use client';
import AdminProductsListComponent from "../../../../../../components/Admin/Products";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminRejectedProductsList() {

  return (
    <AdminProductsListComponent title={'Rejected Products List'} endpoint={endpointsPath.productAdmin+"/declined"}/>
  );
}
