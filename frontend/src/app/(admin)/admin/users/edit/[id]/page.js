
import AdminEditUserComponent from "../../../../../../../components/Admin/Users/Edit";
import AppStrings from "../../../../../../../constants/Strings";

export const metadata = {
    title: `User Profile Update - ${AppStrings.title}`
  };

export default function AdminUserProfileUpdate() {
    
  return (
    <div className="py-10">
    <AdminEditUserComponent/>
    </div>
  );
}
