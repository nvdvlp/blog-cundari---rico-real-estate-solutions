'use client';
import { usePostContext } from '../../context/context';

export default function PostPage({ params }){
    const { posts } = usePostContext()
    const {id} = params;
    

    const post = posts ? posts[id] : null;
    
    if(!post){
        return <p>Post Not Found</p>
    }

    return(
        <div>
            <h2>{post.title}</h2>
            {post.image && <img src={post.image} alt="Post Image" style={{ maxWidth: '100%' }} />}
            <p>{post.description}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <button onClick={() => router.back()}>Volver</button>
        </div>
    );
}
