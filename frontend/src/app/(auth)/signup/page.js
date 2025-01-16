
export const metadata = {
  title: `Sign Up - ${AppStrings.title}`,
  description: "Account registration",
};

import SignupComponent from "../../../../components/Auth/signup";
import AppStrings from "../../../../constants/Strings";

export default function SignupPage(){
  return <SignupComponent/>
}
