'use client'; 
//link for connect the routes
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import '../css/Header.css';

export default function Header(){
    const pathname = usePathname(); 

    return(
        <header>
            <div class='brandContainer'>
                <div class='logo'></div>
                <div class='nameLogo'>
                    <h2 class='cudariRico'>Cundari & Rico</h2>
                    <h2 class='realState'>Real Estate Solutions</h2>    
                </div>
            </div>
            <nav>
                <ul>
                    <li className={pathname.includes('/viewPost') ? 'active' : ''}>
                        <Link href="/viewPost">
                            BLOG
                        </Link>
                    </li>
                    <li className={pathname === '/services' ? 'active' : ''}>
                        <Link href="/services">
                            SERVICES
                        </Link>
                    </li>
                    <li className={pathname === '/properties' ? 'active' : ''}>
                        <Link href="/properties">
                            PROPERTIES
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}   
