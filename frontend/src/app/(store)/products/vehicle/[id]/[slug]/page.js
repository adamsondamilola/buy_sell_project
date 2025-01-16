"use client"
import { useParams } from "next/navigation";
import ViewVehicleProductComponent from "../../../../../../../components/Products/ViewVehicle";
const ViewVehicleProductScreen = () => {
    const { id } = useParams();
  return (
   <ViewVehicleProductComponent id={id}/>
  )
};

export default ViewVehicleProductScreen;
