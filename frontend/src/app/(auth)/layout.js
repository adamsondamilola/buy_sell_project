import React from 'react';
import { NavBarComponent } from '../../../components/NavBar';
import BottomNav from '../../../components/NavBarBottom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import localFont from "next/font/local";
import "../globals.css";
import AppStrings from '../../../constants/Strings';
import AppImages from '../../../constants/Images';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
    title: `Account - ${AppStrings.title}`,
    description: AppStrings.description,
    openGraph: {
      title: 'Account - '+AppStrings.title,
      description: AppStrings.description,
      images: [
        {
          url: AppImages.meta, // Replace with your actual image path
          width: 1200,
          height: 630,
          alt: 'IMG',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Account - '+ AppStrings.title,
      description: AppStrings.description,
      images: [AppImages.meta], // Replace with your actual image path
    },
  };

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <div className="min-h-screen bg-gray-100">
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <main className="container mx-auto px-4 py-8">
        {children}
        <ToastContainer/>
      </main>
      </div>
      <BottomNav/>
      <footer className="hidden lg:block md:block inset-x-0 bottom-0 bg-white shadow py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; 2024 BuySell.com. All rights reserved.
        </div>
      </footer>
    </div>
      </body>
    </html>
    
  );
}
