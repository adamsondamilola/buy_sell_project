"use client"
import { useParams } from "next/navigation";
import ViewMotorcycleUserComponent from "../../../../../../../components/User/Products/ViewMotorcycleTricycle";
const UserViewMotorcycleScreen = () => {
  const { id } = useParams();
  return (
   <ViewMotorcycleUserComponent id={id} />
  )
};

export default UserViewMotorcycleScreen;
