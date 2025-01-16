
export const metadata = {
    title: `Password Reset - ${AppStrings.title}`,
    description: "Account password reset",
  };
  
import PasswordResetComponent from "../../../../components/Auth/passwordReset";
  import AppStrings from "../../../../constants/Strings";
  
  export default function PasswordResetPage(){
    return <PasswordResetComponent/>
  }
  