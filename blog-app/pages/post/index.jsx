'use client';
import './index.css';
import '../../app/css/global.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createPost from '@/app/lib/createPost';
import updateDisplayName from '@/app/lib/updateDisplayName';
import Supabase from '../../app/lib/supabaseClient';
import Loader from '../../app/components/loader';
import deletePost from '../../app/lib/deletePost';
import Header from '../../app/components/Header';

function ViewPost() {
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]); 
    const [isNavigating, setIsNavigating] = useState(false);

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
        async function fetchPosts() {
            const { data: { user }, error: authError } = await Supabase.auth.getUser();
            if (authError || !user) {
                console.error('Error fetching user:', authError);
                return;
            }

            const { data, error } = await Supabase
                .from('Posts')
                .select(`
                    *,
                    Post_tags (
                        tag_id,
                        Tags (
                            tag_name
                        )
                    )
                `)
                .eq('user_uuid', user.id); // Filtra posts por user_uuid

                if (error) {
                    console.error('Error fetching posts:', error);
                } else {
                    const formattedPosts = data.map(post => ({
                        ...post,
                        tags: post.Post_tags.map(pt => pt.Tags.tag_name)
                    }));
                    setPosts(formattedPosts); // Establece el estado con los posts formateados
                    setFilteredPosts(formattedPosts); // Establece los posts filtrados también
                }
            setLoading(false);
        }

        async function fetchTags() {
            const { data, error } = await Supabase
                .from('Tags')
                .select('tag_name');
    
            if (error) {
                console.error('Error fetching tags:', error);
            } else {
                setAllTags(data); // Guarda todos los tags en el estado
            }
        }
    
        fetchTags();
        fetchPosts();
    }, []); 

    //borrar post
    async function deletePostHandler(postId) {
        const { success, error } = await deletePost(postId);
        if (error) {
            alert("Ocurrió un error borrando el post");
        } else if (success) {
            alert("Se eliminó el post exitosamente");
            setPosts(posts.filter(post => post.post_id !== postId)); // Actualiza el estado local sin recargar
            setFilteredPosts(filteredPosts.filter(post => post.post_id !== postId));
        }
    }

    //buscar post
    function handleSearchInputChange(e) {
        setSearchTerm(e.target.value.toLowerCase());
    }

    //clickear para buscar post
    function handleSearchButtonClick() {
        const filtered = posts.filter(post => 
            post.post_title.toLowerCase().includes(searchTerm)
        );
        setFilteredPosts(filtered); 
    }

    function handleTagClick(tag) {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag) // Remueve si ya está seleccionado
            : [...selectedTags, tag];             // Agrega si no está seleccionado

        setSelectedTags(updatedTags);

        // Filtra los posts para que incluyan al menos uno de los tags seleccionados
        const filtered = posts.filter(post => 
            updatedTags.length === 0 || post.tags.some(tag => updatedTags.includes(tag))
        );

        setFilteredPosts(filtered);
    }

    if (loading) {
        return <Loader />;
    }

    function handleNavigateToPost(postId) {
        setIsNavigating(true); // Muestra el loader
        router.push(`/post/${postId}`);
    }
    
    function handleNavigateToEditPost(postId) {
        setIsNavigating(true); // Muestra el loader
        router.push(`/editPost/${postId}`);
    }
    
    function handleNavigateToCreatePost() {
        setIsNavigating(true); // Muestra el loader
        router.push(`/createPost`);
    }
    
    return (   
        <> 
            <Header />
            <section className='viewPost'>
                <div className='viewPost__sort'>
                    <div className='sort__presentation'>
                        <h2 className='presentation__tinyText'>Need guidance in real estate?</h2>
                        <section className='presentation__bannerContainer'>
                            <h2 className='presentation__bigText'>Begin your journey with expert advice!</h2>
                            <div className='presentation__sortInput'>
                                <input 
                                    className='sortInput__input' 
                                    placeholder='Sort by post'
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchInputChange}
                                />
                                <div className='sortInput__buttonIcon'>
                                    <ion-icon 
                                    class='buttonIcon__searchIcon'
                                    onClick={handleSearchButtonClick}
                                    name="search-outline">
                                    </ion-icon>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className='sort__tags'>
                        <h2 className='tags__usedTags'>All Tags:</h2>
                        <div className='usedTags__tagContainer'>
                            {allTags.length > 0 ? (
                                allTags.map((tag, index) => (
                                    <div 
                                        key={index}
                                        className={`tagContainer__tag ${selectedTags.includes(tag.tag_name) ? 'active-tag' : ''}`}
                                        onClick={() => handleTagClick(tag.tag_name)}
                                    >
                                        {tag.tag_name}
                                    </div>
                                ))
                            ) : (
                                <div>No tags available</div> 
                            )}
                        </div>
                    </div>       
                </div>

                <div className='viewPost__sectionTitle'>
                    <h2 className='viewPost__title'>Your Posts</h2>
                    <button onClick={() => handleNavigateToCreatePost()} className='viewPost__newPost'>New Post</button>
                </div>

                <div className='viewPost__postContainer'>
                    {filteredPosts.map((post) => {
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
                                    <ion-icon class='viewPost__create' name="create" onClick={() => handleNavigateToEditPost(post.post_id)}></ion-icon>
                                    <ion-icon 
                                        class='viewPost__link' 
                                        name="link"
                                        onClick={() => handleNavigateToPost(post.post_id)}
                                    ></ion-icon>
                                    <ion-icon name="trash" class='viewPost__trash' onClick={() => deletePostHandler(post.post_id)}></ion-icon>
                                </div>
                                <div className='viewPost__textContainer'>
                                    <h2 className='viewPost__date'>
                                        {displayName} |
                                        <span className='viewPost__by'>&nbsp;{postCreatedAt}</span>
                                    </h2>
                                    <h2 className='viewPost__postTitle truncated-text'
                                        onClick={() => {

                                            router.push(`/post/${post.post_id}`);
                                        }}>{post.post_title}</h2>
                                    <h2 className='viewPost__postContent truncated-text-2'>{post.post_desc}</h2>
                                    

                                        {/* Renderizar los tags asociados */}
                                        <div className='viewPost__tagsContainer'>
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className='viewPost__tag'>{tag}</span>
                                        ))}
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );   
}

export default ViewPost;