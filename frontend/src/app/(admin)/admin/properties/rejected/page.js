'use client';
import PropertiesListComponent from "../../../../../../components/Admin/Properties";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminRejectedPropertiesList() {

  return (
    <PropertiesListComponent title={'Rejected Properties List'} endpoint={endpointsPath.propertyAdmin+"/declined"}/>
  );
}
