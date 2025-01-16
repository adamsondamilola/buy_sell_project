'use client';
import AdminUsersListComponent from "../../../../../../components/Admin/Users";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminUsersList() {

  return (
    <AdminUsersListComponent title={'Blocked Users List'} endpoint={endpointsPath.userAdmin+'/blocked/list'}/>
  );
}
