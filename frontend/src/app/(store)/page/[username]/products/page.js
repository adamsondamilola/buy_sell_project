import { Metadata } from 'next';
import AppStrings from '../../../../../../constants/Strings';
import ProductsByUsernameAllComponent from '../../../../../../components/Products/ProductsByUsername/all';

export const metadata = {
    title: `Page Products - ${AppStrings.title}`,
    description: AppStrings.description,
  };

const PageUserProducts = () => {
  return (
    <> 
    <title>{metadata.title}</title> 
    <meta name="description" content={metadata.description} /> 
    {/* Other head elements can go here */} 
    <h4 className="text-lg font-semibold ml-4">Products</h4>
    <ProductsByUsernameAllComponent/>
    </>
  )
};

export default PageUserProducts;
