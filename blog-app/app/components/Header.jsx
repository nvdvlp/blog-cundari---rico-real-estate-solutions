'use client'; 
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import '../css/Header.css';
import Supabase from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import stateImage from '../public/static/logo.jpg'



export default function Header(){
    const pathname = usePathname(); 
    const router = useRouter(); 

    async function logoutUser() {
        const { error } = await Supabase.auth.signOut();
        localStorage.removeItem('authID')
      
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
                <Image 
                    src={`${stateImage.src}`}     
                    alt="Description of the image" 
                    width={50} 
                    height={50} 
                />
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
                </ul>
            </nav>
            {/* {pathname !== '/login' && (
                        <button className='buttonLogin loginTextButton' onClick={logoutUser}>
                            Log Out
                        </button>
                    )} */}
        </header>
    )
}   
