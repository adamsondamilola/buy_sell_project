export const metadata = {
    title: `Privacy Policy - ${AppStrings.title}`,
    description: AppStrings.description,
  };
import PrivacyPolicyComponent from "../../../../components/PrivacyPolicy";
import AppStrings from "../../../../constants/Strings";

const Policy = () => {
  return (
    <PrivacyPolicyComponent/>
  )
};

export default Policy;
