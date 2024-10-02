// home and header page

//link for connect the routes
import Link from 'next/link';

export default function Header(){
    return(
        <header>
            <div>
                <h2>Cundari & Rico Real</h2>
                <h2>Estate Solutions</h2>        
                <h2>
                    Whether you're looking to purchase your dream home or sell your current property,
                    we can help you navigate the process smoothly.
                </h2>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog">
                            Blog Post
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            About Page
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact">
                            Contact
                        </Link>
                    </li>
                </ul>
                <h2>nav menu</h2>
            </nav>
        </header>
    )
}   