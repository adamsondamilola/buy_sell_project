"use client"

import { useParams } from "next/navigation";
import ProductAdminActionsComponent from "../../../../../../../components/Admin/Products/Actions";
import ViewProductUserComponent from "../../../../../../../components/User/Products/View";

const AdminViewProductScreen = () => {
  const { id } = useParams();
  return (
    <div>
   <ViewProductUserComponent id={id}/>
   <div className="grid grid-cols-1 gap-4">
   <ProductAdminActionsComponent id={id}/>
   </div>
   </div>
  )
};

export default AdminViewProductScreen;
