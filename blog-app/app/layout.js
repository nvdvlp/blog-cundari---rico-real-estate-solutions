import './global.css'
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />

          {children}
      </body>
    </html>
  )
}
