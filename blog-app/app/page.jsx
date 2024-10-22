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
        
        <section className='loaderContainer'>
            <span className="loader"></span>   
            <p className='p'>Cargando... </p>
        </section>
    )
}