export const metadata = {
    title: `Products - ${AppStrings.title}`,
    description: AppStrings.description,
  };

import RecentProductsComponent from "../../../../components/Products/RecentProducts";
import AppStrings from "../../../../constants/Strings";

const ProductsList = () => {
    return ( <RecentProductsComponent/>
      );
};

export default ProductsList;
