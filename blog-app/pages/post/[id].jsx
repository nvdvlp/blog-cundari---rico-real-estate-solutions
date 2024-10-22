// post
'use client';
import './post.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Loader from '@/app/components/loader';
import Header from '../../app/components/Header';
import Supabase from '@/app/lib/supabaseClient';

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;
    const [postDetails, setPostDetails] = useState(null);
    const [postURL, setPostURL] = useState('');
    const [loading, setLoading] = useState(true); // Estado para gestionar la carga

    const fecha = new Date(); 
    const day = fecha.getDate();      
    const meses = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = meses[fecha.getMonth()]; 
    const year = fecha.getFullYear();

    useEffect(() => {
        const fetchPostDetails = async () => {

            const { data, error } = await Supabase
            .from('Posts') 
            .select('*')
            .eq('post_id', id) 
            .single(); 

            if (error) {
                console.error('Error fetching post:', error);
                setLoading(false);
                return; 
            }

            if (data) {
                setPostDetails(data);
                const postPath = `${window.location.origin}/post/${data.post_id}`;
                setPostURL(postPath);
            } else {
                console.error('No post found for the provided ID:', id);
            }
            setLoading(false); 
        }
        fetchPostDetails();
    }, [id]);
    
    if (loading) {
        return <Loader />;
    }

    if (!postDetails) {
        return <p>The post is not found.</p>;
    }

    return (
        <> 
            <Header />
        <section className='post'>
            <div className='post__titleSection'>
                <h1 className='titleSection__postTitle'>{postDetails.post_title}</h1>
                <p className='titleSection__postDesc'>{postDetails.post_desc}</p>
            </div>

            <div className='post__socialDateContainer'>
                <p className='socialDateContainer__date'>{`${month} ${day}, ${year}`}</p>
                <div className='socialDateContainer__socialMediaContainer'>
                    <a 
                        href={`https://api.whatsapp.com/send?text=¡Mira este post increíble! ${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-whatsapp" className='mediaIcon'></ion-icon>
                    </a>

                    <a 
                        href={`https://twitter.com/intent/tweet?url=${postURL}&text=¡Mira este post increíble!`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-twitter" className='mediaIcon'></ion-icon>
                    </a>

                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-facebook" className='mediaIcon'></ion-icon>
                    </a>
                </div>
            </div>

            <img
                className='post__img'
                src={postDetails.post_banner_img_b64}
                alt={postDetails.post_title}
            />
            <div
                className="post__infoPost"
                dangerouslySetInnerHTML={{ __html: postDetails.post_html }}
                style={{ whiteSpace: 'pre-wrap' }}
            />
        </section>
        
        </>
    );
}