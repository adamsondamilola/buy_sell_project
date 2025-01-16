
import AdminUserProductsListComponent from "../../../../../../../components/Admin/Users/Products";
import AppStrings from "../../../../../../../constants/Strings";

export const metadata = {
    title: `User Products - ${AppStrings.title}`
  };

export default function AdminUserProoducts() {
    
  return (
    <div className="py-4">
    <AdminUserProductsListComponent/>
    </div>
  );
}
