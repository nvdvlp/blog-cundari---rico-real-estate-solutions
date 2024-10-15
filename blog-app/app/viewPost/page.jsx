'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../css/viewPost.css'
import Link from 'next/link';

function ViewPost(){

    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authID'); // Or sessionStorage, depending on your auth
        if (!token) {
            router.push('/login'); // Redirect to login if not authenticated
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return <div>Loading...</div>;

    const posts = Array(4).fill({
        title:'Much longer sample text for example',
        content: 'Lorem ipsum dolor amet sit sample text, maximum text to word break.',
    })
    
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
                            <h2 className='viewPost__postTitle'>{post.title}</h2>
                            <h2 className='viewPost__postContent'>{post.content}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );   
}

export default ViewPost;