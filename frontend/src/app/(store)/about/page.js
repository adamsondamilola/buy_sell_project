export const metadata = {
    title: `About - ${AppStrings.title}`,
    description: AppStrings.description,
  };

import AboutComponent from '../../../../components/About';
import AppStrings from '../../../../constants/Strings';

const About = () => {
  return (
    <AboutComponent/>
  )
};

export default About;
