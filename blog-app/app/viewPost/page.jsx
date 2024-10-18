'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../css/viewPost.css'
import Link from 'next/link';
import Supabase from '../lib/supabaseClient';
import Loader from '../components/loader';
import deletePost from '../lib/deletePost';

function ViewPost(){
    const [posts, setPosts] = useState([]);
    const [latestPost, setLatestPost] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPost, setFilteredPost] = useState(null);

    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fecha = new Date(); 

    useEffect(() => {
        const token = localStorage.getItem('authID'); // O sessionStorage, según tu autenticación
        if (!token) {
            router.push('/login'); // Redirige a login si no está autenticado
        } else {
            setIsAuthenticated(true);
        }
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
                .eq('user_uuid', user.id)  // Filtra posts por user_uuid
                .order('created_at', { ascending: false }) // Ordena por fecha

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
                if (data.length > 0) {
                    setLatestPost(data[0]); // Establece el último post
                }
            }
            setLoading(false);
        }
        fetchPosts();
    }, []); 

    const handleSearch = () => {
        if (!searchQuery) {
            setFilteredPost(null);
            return;
        }

        //metodo de busqueda
        const foundPost = posts.find(post =>
            post.post_title.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredPost(foundPost || null);
    }

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
        <section className='viewPost'>

            <div className='viewPost__userSection'>
                <div className='userSection__firstSec'>
                    <div className='firstSec__titleContainer'>
                        <h2 className='titleContainer__textQuestion'>Looking for real estate tips? </h2>
                        <h2 className='titleContainer__textStart'>Start your search now!</h2>
                    </div>

                    <div className='userSection__searchBar'>
                        <input 
                        className='searchBar__input' 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Search on Enter
                        />
                        <div class='searchBar__iconSection' onClick={handleSearch}>
                            <ion-icon class='iconSection__searchIcon' name="search-outline"></ion-icon>
                        </div>
                    </div>
                </div>

                <div className='viewPost__lastPost'>
                    {filteredPost || latestPost ? ( // Solo muestra si hay un último post
                        <>
                            <img src={(filteredPost || latestPost).post_banner_img_b64} alt={(filteredPost || latestPost).post_title} className='lastPost__img' />
                            <div className='lastPost__information'>
                                <h2 className='information__title'>{(filteredPost || latestPost).post_title}</h2>
                                <h2 className='information__date'>{new Date((filteredPost || latestPost).created_at).toLocaleDateString()}</h2>
                                <h2 className='information__dataPost'>{(filteredPost || latestPost).post_desc}</h2>
                                <div className='information__keepReadingContainer' onClick={() => {
                                    localStorage.setItem('selectedPost', JSON.stringify(filteredPost || latestPost));
                                    router.push('/viewPost/CreatePost/userPost/post');
                                }}>
                                <h2 className='keepReadingContainer__text'>Keep reading</h2>
                                <ion-icon class='keepReadingContainer__icon' name="arrow-redo"></ion-icon>
                        </div>
                    </div>
                    </>
                ): null}
                </div>
            </div>

            <div className='viewPost__sectionTitle'>
                <h2 className='viewPost__title'>The Latest</h2>
                {/* <Link href='viewPost/CreatePost'>
                    <button className='viewPost__newPost'>New Post</button>
                </Link> */}
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
    );   
}

export default ViewPost;