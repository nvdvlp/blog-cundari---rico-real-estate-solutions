// home and header page

//link for connect the routes
import Link from 'next/link';
import './Header.css'

export default function Header(){
    return(
        <header>
            <div class='brandContainer'>
                <img class='logo' src="../public/images/logo.jpg" alt="" />
                <div class='nameLogo'>
                    <h2 class='cudariRico'>Cundari & Rico</h2>
                    <h2 class='realState'>Real Estate Solutions</h2>    
                </div>
                {/* <h2>
                    Whether you're looking to purchase your dream home or sell your current property,
                    we can help you navigate the process smoothly.
                </h2> */}
            </div>
            <nav>
                <ul>
                    <li>
                        <Link href="/blog">
                            BLOG
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            SERVICES
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact">
                            PROPERTIES
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}   
