"use client"
import { useParams } from "next/navigation";
import ViewVehicleUserComponent from "../../../../../../../components/User/Products/ViewVehicle";
import ProductAdminActionsComponent from "../../../../../../../components/Admin/Products/Actions";
const UserViewVehicleScreen = () => {
  const { id } = useParams();
  return (
    <>
   <ViewVehicleUserComponent id={id} />
   <ProductAdminActionsComponent id={id}/>
   </>
  )
};

export default UserViewVehicleScreen;
