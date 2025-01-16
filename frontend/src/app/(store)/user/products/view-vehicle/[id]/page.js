"use client"
import { useParams } from "next/navigation";
import ViewVehicleUserComponent from "../../../../../../../components/User/Products/ViewVehicle";
const UserViewVehicleScreen = () => {
  const { id } = useParams();
  return (
   <ViewVehicleUserComponent id={id} />
  )
};

export default UserViewVehicleScreen;
