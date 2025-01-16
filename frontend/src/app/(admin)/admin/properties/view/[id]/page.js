"use client"

import { useParams } from "next/navigation";
import ViewpropertyUserComponent from "../../../../../../../components/User/Properties/View";
import PropertyAdminActionsComponent from "../../../../../../../components/Admin/Properties/Actions";

const AdminViewPropertiescreen = () => {
  const { id } = useParams();
  return (
    <div>
   <ViewpropertyUserComponent id={id}/>
   <div className="grid grid-cols-1 gap-4">
   <PropertyAdminActionsComponent id={id}/>
   </div>
   </div>
  )
};

export default AdminViewPropertiescreen;
