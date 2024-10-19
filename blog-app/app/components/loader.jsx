'use client';
import './loader.css';
import { useState, useEffect } from 'react';

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

