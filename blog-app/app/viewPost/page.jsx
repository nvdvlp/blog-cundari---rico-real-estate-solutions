'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../css/viewPost.css'
import Link from 'next/link';
import Supabase from '../lib/supabaseClient';

function ViewPost(){
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authID'); // Or sessionStorage, depending on your auth
        if (!token) {
            router.push('/login'); // Redirect to login if not authenticated
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    useEffect(() => {
        async function fetchPosts() {
          // Get the authenticated user
          const { data: { user }, error: authError } = await Supabase.auth.getUser();
    
          if (authError || !user) {
            console.error('Error fetching user:', authError);
            return;
          }
    
          // Fetch posts where user_uuid matches the logged-in user ID
          const { data, error } = await Supabase
            .from('Posts')
            .select('*')
            .eq('user_uuid', user.id);  // Filters posts by user_uuid
    
          if (error) {
            console.error('Error fetching posts:', error);
          } else {
            setPosts(data);
            console.log("data")
            console.log(data)
          }
    
          setLoading(false);
        }
    
        fetchPosts();
      }, []);  // Empty array ensures this runs only once when the component mounts
    
      if (loading) {
        return <p>Loading posts...</p>;
      }
    
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
                        <div className='viewPost__imgPost'>
                            <div className='viewPost__iconsSection'>
                                <ion-icon className='viewPost__create' name="create"></ion-icon>
                                <ion-icon className='viewPost__link' name="link"></ion-icon>
                            </div>
                        </div>
                        <div className='viewPost__textContainer'>
                            <h2 className='viewPost__postTitle'>{post.post_title}</h2>
                            <h2 className='viewPost__postContent'>{post.post_desc}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );   
}

export default ViewPost;