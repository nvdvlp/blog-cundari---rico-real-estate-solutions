<<<<<<< Updated upstream:blog-app/app/viewPost/page.jsx
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../css/viewPost.css'
import Link from 'next/link';
import Supabase from '../lib/supabaseClient';
import Loader from '../components/loader';
import deletePost from '../lib/deletePost';
=======
'use client';
import './index.css';
import '../../app/css/global.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import updateDisplayName from '@/app/lib/updateDisplayName';
import Supabase from '../../app/lib/supabaseClient';
import Loader from '../../app/components/loader';
import deletePost from '../../app/lib/deletePost';
import Header from '../../app/components/Header';
>>>>>>> Stashed changes:blog-app/pages/post/index.jsx

function ViewPost() {
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
<<<<<<< Updated upstream:blog-app/app/viewPost/page.jsx

    useEffect(() => {
        const token = localStorage.getItem('authID'); // O sessionStorage, según tu autenticación
        if (!token) {
            router.push('/login'); // Redirige a login si no está autenticado
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    useEffect(() => {
=======
    const [selectedPost, setSelectedPost] = useState(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authID');
        if (!token) {
            router.push('/login');
            return;
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
    }, [router]);

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
>>>>>>> Stashed changes:blog-app/pages/post/index.jsx
        async function fetchPosts() {
            const { data: { user }, error: authError } = await Supabase.auth.getUser();
            if (authError || !user) {
                console.error('Error fetching user:', authError);
                return;
            }

            const { data, error } = await Supabase
                .from('Posts')
                .select('*')
                .eq('user_uuid', user.id); // Filtra posts por user_uuid

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }

            setLoading(false);
        }

        fetchPosts();
    }, []); 
<<<<<<< Updated upstream:blog-app/app/viewPost/page.jsx
    async function deletePostHandler(postId){
        const { success, error } = await deletePost(postId)

        if(error){
            alert("ocurrio un error borrando el post")
        } else if(success){
            alert("Se eliminó el post exitosamente")
            location.reload()
=======

    async function deletePostHandler(postId) {
        const { success, error } = await deletePost(postId);
        if (error) {
            alert("Ocurrió un error borrando el post");
        } else if (success) {
            alert("Se eliminó el post exitosamente");
            setPosts(posts.filter(post => post.post_id !== postId)); // Actualiza el estado local sin recargar
>>>>>>> Stashed changes:blog-app/pages/post/index.jsx
        }
    }

    if (loading) {
        return <Loader />;
    }
<<<<<<< Updated upstream:blog-app/app/viewPost/page.jsx
    
    return (      
        <section className='viewPost'>

            <div className='viewPost__sectionTitle'>
                <h2 className='viewPost__title'>Your Posts</h2>
                <Link href='viewPost/CreatePost'>
                    <button className='viewPost__newPost'>New Post</button>
                </Link>
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
                                <ion-icon className='viewPost__create' name="create" onClick={() => {
                                        localStorage.setItem('selectedPost', JSON.stringify(post))
                                        router.push('editPost')
                                    }}></ion-icon>
                                    <ion-icon 
                                    className='viewPost__link' 
                                    name="link"
                                    onClick={() => {
                                        localStorage.setItem('selectedPost', JSON.stringify(post))
                                        router.push('/viewPost/CreatePost/userPost/post')
                                    }}
                                    ></ion-icon>
                                <ion-icon name="trash" className='viewPost__link' onClick={() => {
                                        deletePostHandler(post.post_id)
                                    }}></ion-icon>
                            </div>
                        <div className='viewPost__textContainer'>
                            <h2 className='viewPost__postTitle truncated-text'
                            onClick={() => {
                                localStorage.setItem('selectedPost', JSON.stringify(post))
                                router.push('/viewPost/CreatePost/userPost/post')
                            }}>{post.post_title}</h2>
                            <h2 className='viewPost__postContent truncated-text-2'>{post.post_desc}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
=======

    const createdAt = selectedPost ? new Date(selectedPost.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : '';

    return (   
        <> 
            <Header />
            <section className='viewPost'>
                <div className='viewPost__sort'>
                    <div className='sort__presentation'>
                        <h2 className='presentation__tinyText'>Need guidance in real estate?</h2>
                        <h2 className='presentation__bigText'>Begin your journey with expert advice!</h2>
                        <div className='presentation__sortInput'>
                            <input 
                                className='sortInput__input' 
                                placeholder='sort by name post, authors or date!'
                                type="text"
                            />
                            <div className='sortInput__buttonIcon'>
                                <ion-icon class='buttonIcon__searchIcon' name="search-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                    <div className='sort__tags'>
                        <h2 className='tags__usedTags'>Most used Tags:</h2>
                        <div className='usedTags__tagContainer'>
                            <div className='tagContainer__tag'>Hotel</div>
                        </div>
                    </div>
                </div>

                <div className='viewPost__sectionTitle'>
                    <h2 className='viewPost__title'>Your Posts</h2>
                    <button onClick={() => router.push(`/createPost`)} className='viewPost__newPost'>New Post</button>
                </div>

                <div className='viewPost__postContainer'>
                    {posts.map((post) => {
                        const postCreatedAt = new Date(post.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        });

                        return (
                            <div className='viewPost__post' key={post.post_id}>
                                <img
                                    className='viewPost__imgPost'
                                    src={post.post_banner_img_b64}
                                    alt={post.post_title}
                                />
                                <div className='viewPost__iconsSection'>
                                    <ion-icon class='viewPost__create' name="create" onClick={() => {
                                        localStorage.setItem('selectedPost', JSON.stringify(post));
                                        router.push('/editPost');
                                    }}></ion-icon>
                                    <ion-icon 
                                        class='viewPost__link' 
                                        name="link"
                                        onClick={() => {
                                            localStorage.setItem('selectedPost', JSON.stringify(post));
                                            router.push(`/post/${post.post_id}`);
                                        }}
                                    ></ion-icon>
                                    <ion-icon name="trash" class='viewPost__trash' onClick={() => deletePostHandler(post.post_id)}></ion-icon>
                                </div>
                                <div className='viewPost__textContainer'>
                                    <h2 className='viewPost__date'>{postCreatedAt}</h2>
                                    <h2 className='viewPost__postTitle truncated-text'
                                        onClick={() => {
                                            localStorage.setItem('selectedPost', JSON.stringify(post));
                                            router.push(`/post/${post.post_id}`);
                                        }}>{post.post_title}</h2>
                                    <h2 className='viewPost__postContent truncated-text-2'>{post.post_desc}</h2>
                                    <h2 className='viewPost__by'>{displayName}</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
>>>>>>> Stashed changes:blog-app/pages/post/index.jsx
    );   
}

export default ViewPost;
