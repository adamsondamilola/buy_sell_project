import UpdatePasswordComponent from "../../../../../components/Profile/passwordUpdate";
import AppStrings from "../../../../../constants/Strings";

export const metadata = {
  title: `Update Password - ${AppStrings.title}`
};
const UpdateUserPasswordScreen = () => {

  return (
    <UpdatePasswordComponent/>
  );
};

export default UpdateUserPasswordScreen;
