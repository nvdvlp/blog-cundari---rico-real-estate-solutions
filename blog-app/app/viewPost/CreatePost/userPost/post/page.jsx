'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/app/components/loader';
import '../../../../css/post.css'

export default function PostPage() {
    const router = useRouter();
    console.log(window.location.origin);
    const [postDetails, setPostDetails] = useState(null);
    const [postURL, setPostURL] = useState('');

    const fecha = new Date(); 
    const day = fecha.getDate();      
    const meses = ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "Octuber", "November", "December"];
    const month = meses[fecha.getMonth()]; 
    const year = fecha.getFullYear();

    function stripHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // Reemplazar <br> por saltos de línea y devolver el texto plano
        return doc.body.textContent.replace(/<br\s*\/?>/gi, '\n') || "";
    }

    useEffect(() => {
        if (typeof window !== 'undefined'){
            const savedPost = localStorage.getItem('selectedPost');
            if (savedPost) {
                const post = JSON.parse(savedPost)
                setPostDetails(post);
    
                //build actual post url
                const postPath = `${window.location.origin}/viewPost/CreatePost/userPost/post?postId=${post.post_id}`;
                setPostURL(postPath);
            }
        }
    }, [router]);

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
                    {/* Link para compartir en WhatsApp */}
                    <a 
                        href={`https://api.whatsapp.com/send?text=¡Mira este post increíble! ${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-whatsapp" className='mediaIcon'></ion-icon>
                    </a>

                    {/* Link para compartir en Twitter */}
                    <a 
                        href={`https://twitter.com/intent/tweet?url=${postURL}&text=¡Mira este post increíble!`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-twitter" className='mediaIcon'></ion-icon>
                    </a>

                    {/* Link para compartir en Facebook */}
                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-facebook" className='mediaIcon'></ion-icon>
                    </a>

                    {/* Instagram no permite compartir directamente enlaces, por lo que no hay URL */}
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <ion-icon name="logo-instagram" className='mediaIcon'></ion-icon>
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