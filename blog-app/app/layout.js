import './global.css'
import Header from './Header'

export const metadata = {
  title: 'blog',
  description: 'wellcome to my blog',
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
