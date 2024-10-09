'use client'; 
//link for connect the routes
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import './Header.css'

export default function Header(){
    const pathname = usePathname(); 

    return(
        <header>
            <div class='brandContainer'>
                <img class='logo' src="../public/logo.jpg" alt="" />
                <div class='nameLogo'>
                    <h2 class='cudariRico'>Cundari & Rico</h2>
                    <h2 class='realState'>Real Estate Solutions</h2>    
                </div>
            </div>
            <nav>
                <ul>
                    <li className={pathname === '/postPage' ? 'active' : ''}>
                        <Link href="/postPage">
                            BLOG
                        </Link>
                    </li>
                    <li className={pathname === '/about' ? 'active' : ''}>
                        <Link href="/about">
                            SERVICES
                        </Link>
                    </li>
                    <li className={pathname === '/contact' ? 'active' : ''}>
                        <Link href="/contact">
                            PROPERTIES
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}   
