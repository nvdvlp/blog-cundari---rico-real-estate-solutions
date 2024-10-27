import './css/global.css'
<<<<<<< Updated upstream
//import fonts
import { Inter } from 'next/font/google'
//import components all components in layout
=======
import { Inter, Merriweather, Roboto, Playfair_Display } from 'next/font/google'
>>>>>>> Stashed changes
import Header from './components/Header'
import Script from 'next/script';

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
  weight: ["300", "400", "500", "700"],
  styles: ["italic", "normal"],
  subsets: ["latin"],
})

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  styles: ["italic", "normal"],
  subsets: ["latin"],
})

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  weight: ["400", "700"],
  styles: ["italic", "normal"],
  subsets: ["latin"],
})
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          crossOrigin="anonymous"
          strategy="afterInteractive" // Load before the interactive part
        />

        {/* Fallback for older browsers */}
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
