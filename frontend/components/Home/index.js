import RecentProductsComponent from '../Products/RecentProducts';
import { SearchComponent } from '../SearchItems';

export default function HomeComponent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black-900">  
      <div className="flex"> 
        <div className="w-full"> {/* Main content adjusts to the fixed aside */}
        <div className="w-full h-24 lg:h-14 md:h-48 flex flex-col items-center justify-center">
          <div className='md:hidden w-full'>
          <SearchComponent />
          </div>
        </div>
        <RecentProductsComponent/>
        </div>
      </div>      
    </div>
  );
}
