export const metadata = {
  title: `Favorites - ${AppStrings.title}`,
  description: 'Favorite products',
}
import FavoriteProductsComponent from "../../../../components/Products/FavoriteProducts";
import AppStrings from "../../../../constants/Strings";

const Favorites = () => {
  return (
   <FavoriteProductsComponent />
  )
};

export default Favorites;
