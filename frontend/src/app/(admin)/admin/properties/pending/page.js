'use client';
import PropertiesListComponent from "../../../../../../components/Admin/Properties";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminPendingPropertiesList() {

  return (
    <PropertiesListComponent title={'Pending Properties List'} endpoint={endpointsPath.propertyAdmin+"/pending"}/>
  );
}
