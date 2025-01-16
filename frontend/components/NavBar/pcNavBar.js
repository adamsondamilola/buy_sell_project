import StoreAsideComponent from "./StoreAsideBar";

export default function PCNavBar() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black-900">  
          <div className="flex"> {/* Define a fixed and flexible grid */}
          <div className="w-1/3 hidden md:block overflow-y-auto"> {/* Fixed width and scrollable */}
      <StoreAsideComponent />
    </div>
          </div>      
        </div>
      );
}