'use client';
import Link from "next/link"
import { usePostContext } from '../../../context/context';
import '../css/preview.css'

export default async function UserPost(){
    const { posts } = usePostContext();

    return (      
        <div class='preview'>
        <h2 class='mainBlogTitle'>Post Created Successfully!</h2>
        {posts.length > 0 ? (
            posts.map((post, index) => (
            <div key={index} class='post'>
                {post.image && <img src={post.image} alt="Post Image" style={{ maxWidth: '100%' }} />}
                <div class='columnPostPreview'>
                    <h2 class='title'>{post.title}</h2>
                    <h3 class='description'>{post.description}</h3>
                </div>
                <Link href={`/blog/${index}`}>
                    <button>Ver Post Completo</button>
                </Link>
            </div>
                ))
                ) : (
                    <p class='nonePost'>There are any post saved</p>
                )}
            <h2 class='mainBlogTitle'>Other Post</h2>    
        </div>
        
    );   
}   