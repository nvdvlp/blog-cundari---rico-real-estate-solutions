'use client'; 
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import '../css/Header.css';
import Supabase from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; 


export default function Header(){
    const pathname = usePathname(); 
    const router = useRouter(); 

    async function logoutUser() {
        const { error } = await Supabase.auth.signOut();
      
        if (error) {
          console.error('Error signing out:', error.message);
        } else {
          console.log('Successfully signed out');
          router.push('/login')
        }
      }

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
                        
                    {pathname !== '/login' && (
                        <button className='buttonLogin loginTextButton' onClick={logoutUser}>
                            Log Out
                        </button>
                    )}
                </ul>
            </nav>
        </header>
    )
}   
