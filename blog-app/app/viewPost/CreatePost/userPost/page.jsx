'use client';
import Link from "next/link"
import { usePostContext } from '../../../context/context';
import { useRouter } from 'next/navigation'; 
import '../../../css/preview.css'

export default async function UserPost(){
    const { posts } = usePostContext();
    const router = useRouter(); 

    const postsSaved = Array(3).fill({
        title:'Sample Text',
        content: 'Lorem ipsum dolor amet sit sample text, maximum text to word break.',
    })

    return (      
        <div class='preview'>
        <h2 class='userPostTitle'>Post Created Successfully!</h2>

        {posts.length > 0 ? (
            posts.map((post, index) => (
            <div key={index} class='post'>
                <div class='columnPostPreviewImage'>
                    {post.image && <img class='postImg' src={post.image} alt="Post Image" style={{ maxWidth: '100%' }} />}
                    <div className='editVisit'>
                        <div className='black' onClick={() => router.back()}>
                            Edit
                        </div>
                        <Link href={`/viewPost/CreatePost/userPost/post/${index}`}>
                            <div className='white'>Visit</div>
                        </Link>
                    </div>
                </div>
                <div class='columnPostPreview'>
                    <h2 class='titlePreviewPost'>{post.title}</h2>
                    <h3 class='descriptionPreviewPost'>{post.description}</h3>
                </div>
            </div>
                ))
                ) : (
                    <p class='nonePost'>There are any post saved</p>
                )}
                <div class='otherPostSeparation'></div>
            <h2 class='userPostTitle'>Other Post</h2>  

            <div className='posts'>
                {postsSaved.map((dummyPost, index) => (
                    <div key={index} className='postview'>
                        <div class='lol'></div>
                        <div className='editVisit'>
                            <div className='black'>Edit</div>
                            <div className='white'>Visit</div>
                        </div>
                        <h2 className='sampleText'>{dummyPost.title}</h2>
                        <h3 className='content'>{dummyPost.content}</h3>
                    </div>
                ))}
            </div>
        </div>    
    );   
}   