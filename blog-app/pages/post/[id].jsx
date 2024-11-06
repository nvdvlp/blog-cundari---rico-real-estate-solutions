// post
'use client';
import './post.css'
import '../../app/css/global.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Loader from '@/app/components/loader';
import Header from '../../app/components/Header';
import Supabase from '@/app/lib/supabaseClient';
import updateDisplayName from '@/app/lib/updateDisplayName';

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;
    const [postDetails, setPostDetails] = useState(null);
    const [postURL, setPostURL] = useState('');
    const [loading, setLoading] = useState(true); // Estado para gestionar la carga
    const [displayName, setDisplayName] = useState('');
    const [selectedTags, setSelectedTags] = useState([])
    const [createdAt, setCreatedAt] = useState(new Date())

    const fecha = new Date(); 
    const day = fecha.getDate();      
    const meses = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = meses[fecha.getMonth()]; 
    const year = fecha.getFullYear();

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!id) return; 
            
            const { data, error } = await Supabase
            .from('Posts') 
            .select('*')
            .eq('post_id', id) 
            .single(); 

            const { data: tagIdArray, error: currentTagsError } = await Supabase
            .from('Post_tags')
            .select('tag_id')
            .eq('post_id', id);


            if (currentTagsError) {
                console.error('Error fetching post:', error);
                setLoading(false);
                return; 
            }

            const tagArray = [];

            if(tagIdArray){
                console.log(tagIdArray)
                for (const tag of tagIdArray) {
                    let { data: tagName, error: tagError } = await Supabase
                    .from('Tags')
                    .select('tag_name')
                    .eq('id', tag.tag_id)
                    .single();

                    tagArray.push(tagName)
                }
                console.log(tagArray)
                setSelectedTags(tagArray)
            }

            if (error) {
                console.error('Error fetching post:', error);
                setLoading(false);
                return; 
            }

            if (data) {
                setCreatedAt(
                    new Date(data.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                )
                console.log(createdAt)
                setPostDetails(data);
                const postPath = `${window.location.origin}/post/${data.post_id}`;
                setPostURL(postPath);
            } else {
                console.error('No post found for the provided ID:', id);
            }
            setLoading(false); 
        }


        async function fetchDisplayName() {
            const userId = 'a5f3ed09-60e3-4454-884c-1541fe11920a'; // UID del usuario
            const newDisplayName = 'Guillermo Rico'; // nombre del usuario
            const result = await updateDisplayName(userId, newDisplayName);
            
            if (!result.error) {
                setDisplayName(newDisplayName); 
                console.log(result.successMessage);
            } else {
                console.error(result.error);
            }
        }
    
        fetchDisplayName();
        fetchPostDetails();
    }, [id]);

    useEffect(() => {
        const loadIonIcons = () => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
            script.async = true;
            document.body.appendChild(script);

            const scriptNoModule = document.createElement('script');
            scriptNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
            scriptNoModule.async = true;
            document.body.appendChild(scriptNoModule);
        };

        loadIonIcons();
    }, []);
    
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
                <div className='usedTags__tagContainer'>
                            {selectedTags.length > 0 ? (
                                selectedTags.map((tag, index) => (
                                    <div
                                        className='viewPost__tag' 
                                        key={index}
                                    >
                                        {tag.tag_name}
                                    </div>
                                ))
                            ) : (
                                <div>No tags available</div> 
                            )}
                        </div>
            </div>

            <div className='post__socialDateContainer'>
                <p className='socialDateContainer__date'>{displayName} | {createdAt}</p>
                <div className='socialDateContainer__socialMediaContainer'>
                    <a 
                        href={`https://api.whatsapp.com/send?text=¡Mira este post increíble! ${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-whatsapp" class='mediaIcon'></ion-icon>
                    </a>

                    <a 
                        href={`https://twitter.com/intent/tweet?url=${postURL}&text=¡Mira este post increíble!`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-twitter" class='mediaIcon'></ion-icon>
                    </a>

                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${postURL}`} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        <ion-icon name="logo-facebook" class='mediaIcon'></ion-icon>
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