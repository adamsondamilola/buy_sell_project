"use client"
import { useParams } from "next/navigation";
import ViewOtherVehicleProductComponent from "../../../../../../../components/Products/ViewMotorcycleTricycle";
const ViewOtherVehicleProductScreen = () => {
    const { id } = useParams();
  return (
   <ViewOtherVehicleProductComponent id={id}/>
  )
};

export default ViewOtherVehicleProductScreen;
