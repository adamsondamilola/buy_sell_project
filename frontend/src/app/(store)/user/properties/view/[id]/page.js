"use client"
import { useParams } from "next/navigation";
import ViewPropertyUserComponent from "../../../../../../../components/User/Properties/View";
const UserViewPropertyScreen = () => {
  const { id } = useParams();
  return (
   <ViewPropertyUserComponent id={id} />
  )
};

export default UserViewPropertyScreen;
