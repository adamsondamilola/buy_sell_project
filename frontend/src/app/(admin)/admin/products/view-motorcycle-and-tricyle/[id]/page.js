"use client"
import { useParams } from "next/navigation";
import ProductAdminActionsComponent from "../../../../../../../components/Admin/Products/Actions";
import ViewMotorcycleUserComponent from "../../../../../../../components/User/Products/ViewMotorcycleTricycle";
const UserViewVehicleScreen = () => {
  const { id } = useParams();
  return (
    <>
   <ViewMotorcycleUserComponent id={id} />
   <ProductAdminActionsComponent id={id}/>
   </>
  )
};

export default UserViewVehicleScreen;
