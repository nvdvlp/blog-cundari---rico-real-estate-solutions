

import './css/global.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Script from 'next/script';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';


export const metadata = {
  title: 'Cundari & Rico Real Estate Solutions',
  description: 'Search available properties for sale or lease',
  keywords: [
    'Homes for rent',
    'Real estate market trends',
    'Commercial properties for sale',
    'Real estate agent services',
    'Property management services'
  ]
}

const inter = Inter({
  weight:["300", "400", "500", "700"],
  styles:["italic", "normal"],
  subsets:["latin"],
})

export default function RootLayout({ children }) {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem('authID'); 
  //   if (token) {
  //     setIsAuthenticated(true); 
  //   } else {
  //     if (router.pathname !== '/login') {
  //       router.push('/login'); // Redirige a login si no está autenticado y no está en la página de login
  //     }
  //   }
  //   setLoading(false); 
  // }, [router]);

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
