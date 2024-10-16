'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/app/components/loader';
import '../../../../css/post.css'

export default function PostPage() {
    const router = useRouter();
    
    const [postDetails, setPostDetails] = useState(null);

    const fecha = new Date(); 
    const day = fecha.getDate();      
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = meses[fecha.getMonth()];  // `getMonth()` devuelve el mes en base 0, así que no hay necesidad de restar 1
    const year = fecha.getFullYear();

    function stripHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // Reemplazar <br> por saltos de línea y devolver el texto plano
        return doc.body.textContent.replace(/<br\s*\/?>/gi, '\n') || "";
    }

    useEffect(() => {
        const savedPost = localStorage.getItem('selectedPost');
        if (savedPost) {
            setPostDetails(JSON.parse(savedPost));
        }
    }, []);

    if (!postDetails) {
        return <Loader></Loader>
    }

    return (
        <section class='post'>
            <div class='post__titleSection'>
                <h1 class='titleSection__postTitle'>{postDetails.post_title}</h1>
                <p class='titleSection__postDesc'>{postDetails.post_desc}</p>
            </div>

            <div class='post__socialDateContainer'>
                <p class='socialDateContainer__date'>{`${month} ${day}, ${year}`}</p>
                <div class='socialDateContainer__socialMediaContainer'>
                <a href="https://api.whatsapp.com/send?text=¡Mira este sitio increíble! https://tusitio.com" target="_blank">
                    <ion-icon name="logo-whatsapp" class='mediaIcon'></ion-icon>
                </a>
                <a href="https://twitter.com/intent/tweet?url=https://tusitio.com&text=¡Mira este sitio increíble!" target="_blank">
                    <ion-icon name="logo-twitter" class='mediaIcon'></ion-icon>
                </a>
                <a href="https://www.instagram.com" target="_blank">
                    <ion-icon name="logo-instagram" class='mediaIcon'></ion-icon>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://tusitio.com" target="_blank">
                    <ion-icon name="logo-facebook" class='mediaIcon'></ion-icon>
                </a>
            </div>
            </div>

            <img
                class='post__img'
                src={postDetails.post_banner_img_b64}
                alt={postDetails.post_title}
            />
            <div
            className="post__infoPost"
            dangerouslySetInnerHTML={{ __html: postDetails.post_html }}
            style={{ whiteSpace: 'pre-wrap' }}
            />
        </section>
    );
}