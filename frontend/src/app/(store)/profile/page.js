import ViewProfileComponent from "../../../../components/User/Profile";
import AppStrings from "../../../../constants/Strings";

export const metadata = {
    title: `Profile - ${AppStrings.title}`
  };

export default function UserProfile() {
  return (
    <div className="py-10">
    <ViewProfileComponent/>
    </div>
  );
}
