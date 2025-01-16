import { Inter } from "next/font/google";
import "../globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { AdminNavBarComponent } from "../../../components/NavBar/adminNav";
import AdminAsideComponent from "../../../components/NavBar/adminAside";
import AppStrings from "../../../constants/Strings";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: AppStrings.title,
  description: AppStrings.description,
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="">
<AdminNavBarComponent/>
</div>
</nav>

<aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-12 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">   
<AdminAsideComponent/>
</div>
</aside>

<div className="p-4 py-12 sm:ml-64">
      {children}
</div>
<div className="bg-blend-overlay bg-blend-screen bg-blend-lighten hover:bg-blend-darken"></div>

<ToastContainer />
      </body>
    </html>
  );
}
