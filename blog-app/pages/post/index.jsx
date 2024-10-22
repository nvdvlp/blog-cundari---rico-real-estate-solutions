// post index.jsx

'use client'
import Link from 'next/link';
import './index.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Supabase from '../../app/lib/supabaseClient';
import Loader from '../../app/components/loader';
import deletePost from '../../app/lib/deletePost';
import Header from '../../app/components/Header';

function ViewPost(){
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
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

    useEffect(() => {
        async function checkAuthentication() {
            const token = localStorage.getItem('authID');
            if (!token) {
                router.push('/login'); // Redirige a login si no está autenticado
            } else {
                // Intenta obtener el usuario autenticado
                const { data: { user }, error } = await Supabase.auth.getUser();
                if (error || !user) {
                    console.error('Error fetching user:', error);
                    router.push('/login'); // Si no hay usuario, redirige a login
                } else {
                    setIsAuthenticated(true);
                }
            }
            setLoading(false); // Asegúrate de detener el loader al final
        }
    
        checkAuthentication();
    }, [router]);

    useEffect(() => {
        async function fetchPosts() {
            // Obtén el usuario autenticado
            const { data: { user }, error: authError } = await Supabase.auth.getUser();

            if (authError || !user) {
                console.error('Error fetching user:', authError);
                return;
            }

            // Obtén los posts donde user_uuid coincide con el ID del usuario autenticado
            const { data, error } = await Supabase
                .from('Posts')
                .select('*')
                .eq('user_uuid', user.id);  // Filtra posts por user_uuid

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
                console.log("data");
                console.log(data);
            }

            setLoading(false);
        }

        fetchPosts();
    }, []); 

    async function deletePostHandler(postId){
        const { success, error } = await deletePost(postId)

        if(error){
            alert("ocurrio un error borrando el post")
        } else if(success){
            alert("Se eliminó el post exitosamente")
            location.reload()
        }
    }
    if (loading) {
        return <Loader></Loader>
    }
    
    return (   
        <> 
            <Header />

        <section className='viewPost'>

            <div className='viewPost__sectionTitle'>
                <h2 className='viewPost__title'>Your Posts</h2>
                <button onClick={() => {
                    router.push(`/createPost`)
                    }}className='viewPost__newPost'>New Post</button>
            </div>

            <div className='viewPost__postContainer'>
            {posts.map((post, index) => (
                    <div className='viewPost__post' key={index}>
                            <img
                            className='viewPost__imgPost'
                            src={post.post_banner_img_b64}
                            alt={post.post_title}
                            />
                            <div className='viewPost__iconsSection'>
                                <ion-icon class='viewPost__create' name="create" onClick={() => {
                                        localStorage.setItem('selectedPost', JSON.stringify(post))
                                        router.push('/editPost')
                                    }}></ion-icon>
                                    <ion-icon 
                                    class='viewPost__link' 
                                    name="link"
                                    onClick={() => {
                                        localStorage.setItem('selectedPost', JSON.stringify(post))
                                        router.push(`/post/${post.post_id}`)
                                    }}
                                    ></ion-icon>
                                <ion-icon name="trash" class='viewPost__trash' onClick={() => {
                                        deletePostHandler(post.post_id)
                                    }}></ion-icon>
                            </div>
                        <div className='viewPost__textContainer'>
                            <h2 className='viewPost__postTitle truncated-text'
                            onClick={() => {
                                localStorage.setItem('selectedPost', JSON.stringify(post))
                                router.push(`/post/${post.post_id}`)
                            }}>{post.post_title}</h2>
                            <h2 className='viewPost__postContent truncated-text-2'>{post.post_desc}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        </>
        
    );   
}

export default ViewPost;