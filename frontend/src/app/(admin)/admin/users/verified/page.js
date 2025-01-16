'use client';
import AdminUsersListComponent from "../../../../../../components/Admin/Users";
import endpointsPath from "../../../../../../constants/EndpointsPath";

export default function AdminUsersList() {

  return (
    <AdminUsersListComponent title={'Verified Users List'} endpoint={endpointsPath.userAdmin+'/verified/list'}/>
  );
}
