
import AdminViewProfileComponent from "../../../../../../../components/Admin/Users/View";
import AppStrings from "../../../../../../../constants/Strings";

export const metadata = {
    title: `User Profile - ${AppStrings.title}`
  };

export default function AdminUserProfile() {
    
  return (
    <div className="py-10">
    <AdminViewProfileComponent/>
    </div>
  );
}
