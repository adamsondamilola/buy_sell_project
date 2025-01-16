export const metadata = {
  title: `Sign In - ${AppStrings.title}`,
  description: "Account Login",
};

import LoginComponent from "../../../../components/Auth/login";
import AppStrings from "../../../../constants/Strings";

const LoginPage = () => {

  return (
    <div className="mt-20">
    <LoginComponent/>
    </div>
  );
}

export default LoginPage;