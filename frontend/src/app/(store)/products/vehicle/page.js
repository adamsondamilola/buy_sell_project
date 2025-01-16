import AppStrings from "../../../../../constants/Strings";
import RecentProductsComponent from "../../../../../components/Products/RecentProducts";

export const metadata = {
    title: `Vehicles - ${AppStrings.title}`,
    description: AppStrings.description,
  };
const Vehicles = () => {
    return (
        <RecentProductsComponent/>
      );
};

export default Vehicles;
