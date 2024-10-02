import './global.css'
//import fonts
import { Roboto } from 'next/font/google'
//import components all components in layout
import Header from './components/Header'

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

//font roboto object
const roboto = Roboto({
  weight:["300", "400", "500", "700"],
  styles:["italic", "normal"],
  subsets:["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />

          {children}
      </body>
    </html>
  )
}
