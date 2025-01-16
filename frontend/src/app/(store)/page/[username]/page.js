import { Metadata } from 'next';
import AppStrings from '../../../../../constants/Strings';
import PageComponent from '../../../../../components/Page/index';

export const metadata = {
    title: `Page - ${AppStrings.title}`,
    description: AppStrings.description,
  };

const UserPage = () => {
  return (
    <> 
    <title>{metadata.title}</title> 
    <meta name="description" content={metadata.description} /> 
    {/* Other head elements can go here */} 
    <PageComponent/>
    </>
  )
};

export default UserPage;
