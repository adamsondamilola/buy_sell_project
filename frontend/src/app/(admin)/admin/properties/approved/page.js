'use client';
import PropertiesListComponent from "../../../../../../components/Admin/Properties";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminApprovedPropertiesList() {

  return (
    <PropertiesListComponent title={'Approved Properties List'} endpoint={endpointsPath.propertyAdmin+"/approved"}/>
  );
}
