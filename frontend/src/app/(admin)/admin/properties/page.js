'use client';
import PropertiesListComponent from "../../../../../components/Admin/Properties";
import endpointsPath from "../../../../../constants/EndpointsPath";

export default function AdminPropertiesList() {

  return (
    <PropertiesListComponent title={'Properties List'} endpoint={endpointsPath.propertyAdmin}/>
  );
}
