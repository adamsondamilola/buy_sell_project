import { Metadata } from 'next';
import AppStrings from '../../../../../../constants/Strings';
import ProductsByUsernameAllComponent from '../../../../../../components/Products/ProductsByUsername/all';
import PropertiesByUsernameAllComponent from '../../../../../../components/Properties/PropertiesByUsername/all';

export const metadata = {
    title: `Page Properies - ${AppStrings.title}`,
    description: AppStrings.description,
  };

const PageUserProperties = () => {
  return (
    <> 
    <title>{metadata.title}</title> 
    <meta name="description" content={metadata.description} /> 
    {/* Other head elements can go here */} 
    <PropertiesByUsernameAllComponent/>
    </>
  )
};

export default PageUserProperties;
