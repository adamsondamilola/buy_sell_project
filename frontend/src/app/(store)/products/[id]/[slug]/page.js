"use client"
import { useParams } from "next/navigation";
import ViewProductComponent from "../../../../../../components/Products/ViewProduct";
const ViewProductScreen = () => {
    const { id } = useParams();
  return (
   <ViewProductComponent id={id}/>
  )
};

export default ViewProductScreen;
