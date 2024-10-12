'use client';
import { usePostContext } from '../../../../context/context';
import { usePostContext } from '../../../../context/context';
import { useRouter } from 'next/navigation';
// import '../../../../css/post.css';

export default function PostPage({ params }){
    const router = useRouter();
    const { posts } = usePostContext()
    const {id} = params;
    const post = posts[id];

    
    if(!post){
        return <p>Post Not Found</p>
    }

    return(
        <div class='postDetail'>
            <button className='backButton' onClick={() => router.back()}>
                Back
            </button>
            <div class='postContent'>
                {post.image && <img className='postImageDetail' src={post.image} alt="Post Image" />}
                <h2 class='postTitle'>{post.title}</h2>
                <h3 class='postDescription'>{post.description}</h3>
                <div class='postBody' dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
}
