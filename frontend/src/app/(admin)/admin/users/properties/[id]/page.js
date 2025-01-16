import AdminUserPropertiesListComponent from "../../../../../../../components/Admin/Users/Properties";
import AppStrings from "../../../../../../../constants/Strings";

export const metadata = {
    title: `User Properties - ${AppStrings.title}`
  };

export default function AdminUserProoducts() {
    
  return (
    <div className="py-4">
    <AdminUserPropertiesListComponent/>
    </div>
  );
}
