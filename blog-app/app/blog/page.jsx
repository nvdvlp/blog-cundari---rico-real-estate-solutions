'use client';
import Link from "next/link"
import { usePostContext } from '../context/context';
import './preview.css'

export default async function Blog(){
    const { posts } = usePostContext();

    return (      
        <div class='preview'>
        <h2 class='mainPostCreationTitle'>Post Created Successfully!</h2>
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
                    <p class='noPost'>There are any post saved</p>
                )}
        </div>
    );   
}   