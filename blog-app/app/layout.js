import './css/global.css'
//import fonts
import { Inter } from 'next/font/google'
//import components all components in layout
import Header from './components/Header'
import { PostProvider } from './context/context.jsx'; 
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false; // Evita la inyección automática de CSS

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

//font Inter object
const inter = Inter({
  weight:["300", "400", "500", "700"],
  styles:["italic", "normal"],
  subsets:["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <PostProvider>
        <Header />
          {children}

        </PostProvider>
      </body>
    </html>
  )
}
