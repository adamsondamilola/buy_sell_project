'use client';
import AdminUsersListComponent from "../../../../../../components/Admin/Users";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminUsersList() {

  return (
    <AdminUsersListComponent title={'Shops List'} endpoint={endpointsPath.userAdmin+'/shops/list'}/>
  );
}
