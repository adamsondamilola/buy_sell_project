"use client"

import { useParams } from "next/navigation";
import ViewProductUserComponent from "../../../../../../../components/User/Products/View";
const UserViewProductScreen = () => {
    const { id } = useParams();
  return (
   <ViewProductUserComponent id={id}/>
  )
};

export default UserViewProductScreen;
