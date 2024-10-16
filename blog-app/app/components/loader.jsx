'use client';
import { useState, useEffect } from 'react';
import '../css/loader.css';

export default function Loader() {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) {
        return null;
    }

    return (
        <section className='loaderContainer'>
            <span className="loader"></span>   
            <p className='p'>Cargando... </p>
        </section>
    );
}

