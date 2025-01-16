"use client";
import { useEffect, useState } from "react";
import AdminProductsListComponent from "../../Products";
import endpointsPath from "../../../../constants/EndpointsPath";
import { useParams } from "next/navigation";

const AdminUserProductsListComponent = () => { 
  const {id} = useParams();

  return(
    <AdminProductsListComponent endpoint={`${endpointsPath.productAdmin}/${id}/user`} />
  );
};

export default AdminUserProductsListComponent;
