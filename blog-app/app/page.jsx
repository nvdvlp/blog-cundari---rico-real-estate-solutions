'use client'
import './not-found.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function NotFound(){
    const router = useRouter();
    useEffect(() => {
        router.push('/login');
    }, [router]);

    return(
        
        <div className="sectionNotFound">
            <h1 className='loginRedirect'>Redirecting to Login...</h1>
        </div>
    )
}