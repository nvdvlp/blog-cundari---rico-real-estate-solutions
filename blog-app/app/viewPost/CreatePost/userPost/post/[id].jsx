'use client';
import { useRouter } from 'next/navigation'; // Asegúrate de importar useRouter
import { usePostContext } from '../../../../context/context'; 

export default function PostPage({ params }) {
    // const router = useRouter();
    // const { posts } = usePostContext();
    // const { id } = params;
    // const post = posts[id];

    // if (!post) {
    //     return <p>Post Not Found</p>;
    // }

    // return (
    //     <div className='postDetail'>
    //         <button className='backButton' onClick={() => router.back()}>
    //             Back
    //         </button>
    //         <div className='postContent'>
    //             {post.image && <img className='postImageDetail' src={post.image} alt="Post Image" />}
    //             <h2 className='postTitle'>{post.title}</h2>
    //             <h3 className='postDescription'>{post.description}</h3>
    //             <p className='postDate'>Published on: {post.date}</p>
    //             <div className='postBody' dangerouslySetInnerHTML={{ __html: post.content }} />

    //             <div className='socialMediaLinks'>
    //                 <a href={post.socialMedia.whatsapp}>WhatsApp</a>
    //                 <a href={post.socialMedia.twitter}>Twitter</a>
    //                 <a href={post.socialMedia.instagram}>Instagram</a>
    //                 <a href={post.socialMedia.facebook}>Facebook</a>
    //             </div>
    //         </div>
    //     </div>
    // );
}