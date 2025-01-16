import AppStrings from "../../../../../constants/Strings";
import RecentProductsComponent from "../../../../../components/Products/RecentProducts";

export const metadata = {
    title: `Bike and Tricycles - ${AppStrings.title}`,
    description: AppStrings.description,
  };
const BikesAndTricycles = () => {
    return (
        <RecentProductsComponent/>
      );
};

export default BikesAndTricycles;
