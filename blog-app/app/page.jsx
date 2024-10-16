'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Loader from './components/loader'
import './css/not-found.css'

export default function NotFound(){
    useEffect(() => {
        router.push('/login');
    }, [])
    return(
        <Loader/>
    )
}