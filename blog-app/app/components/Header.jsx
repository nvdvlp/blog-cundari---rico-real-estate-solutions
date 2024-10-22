// Header jsx
'use client'; 
import './Header.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import Supabase from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; 
import stateImage from '../public/static/logo.jpg'

export default function Header(){
    const pathname = usePathname(); 
    const router = useRouter(); 
    const paths = ['/post', '/createPost', '/editPost'];

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
                    <li className={paths.some(path => pathname.includes(path)) ? 'active' : ''}>
                        <Link href="/post" className="header__link">
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
            {pathname !== '/login' && (
                        <button className='buttonLogin loginTextButton' onClick={logoutUser}>
                            Log Out
                        </button>
                    )}
        </header>
    )
}   
