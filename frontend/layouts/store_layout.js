// components/layout.js
import React from 'react';
import Head from 'next/head';
import BottomNav from '../components/NavBarBottom';
import { NavBarComponent } from '../components/NavBar';

export default function LayoutStore({ children, title = "Cpromoter" }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="bg-white shadow">
        <NavBarComponent/>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <BottomNav/>
      <footer className="hidden lg:block md:block bg-white shadow py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; 2024 BuySell.com. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
