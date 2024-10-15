'use client'; 
//link for connect the routes
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import '../css/Header.css';

export default function Header(){
    const pathname = usePathname(); 

    return(
        <header>
            <div className='brandContainer'>
                <div className='logo'></div>
                <div className='nameLogo'>
                    <h2 className='cudariRico'>CUNDARI & RICO</h2>
                    <h2 className='realState'>REAL ESTATE SOLUTIONS</h2>    
                </div>
            </div>
            <nav>
                <ul>
                    <li className={pathname.includes('/viewPost') ? 'active' : ''}>
                        <Link href="/viewPost" className="header__link">
                            BLOG
                        </Link>
                    </li>
                        {/* <li className={pathname === '/services' ? 'active' : ''}>
                            <Link href="/services" className="header__link">
                                SERVICES
                            </Link>
                        </li>
                        <li className={pathname === '/properties' ? 'active' : ''}>
                            <Link href="/properties" className="header__link">
                                PROPERTIES
                            </Link>
                        </li> */}
                    <button class='buttonLogin'>
                        <Link href="/login" class='loginTextButton'>
                            Login
                        </Link>
                    </button>
                </ul>
            </nav>
        </header>
    )
}   
