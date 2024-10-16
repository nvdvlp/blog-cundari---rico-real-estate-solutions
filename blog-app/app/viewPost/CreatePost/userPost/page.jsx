'use client';
import Link from "next/link"
import { usePostContext } from '../../../context/context';
import { useRouter } from 'next/navigation'; 
import '../../../css/userPost.css'

export default async function UserPost(){
    const { posts } = usePostContext();
    const router = useRouter(); 

    const postsSaved = Array(4).fill({
        title:'Sample Text',
        content: 'Lorem ipsum dolor amet sit sample text, maximum text to word break.',
    })

    return (      
        <div className='userPost'>
        <h2 className='userPost__title'>Post Created Successfully!</h2>

        {posts.length > 0 ? (
            posts.map((post, index) => (
            <div key={index} className='userPost__postCreated'>
                {post.image && <img className='postCreated__postImg' src={post.image} alt="Post Image" style={{ maxWidth: '100%' }} />}
                <div className='postCreated__columnPostPreview'>
                    <h2 className='columnPostPreview__titlePreviewPost'>{post.title}</h2>
                    <h3 className='columnPostPreview__descriptionPreviewPost'>{post.description}</h3>
                    <div className='columnPostPreview__editButtonsContainer'>
                        <div className='editButtonsContainer__editButton' onClick={() => router.back()}>
                            Edit
                        </div>
                        <Link href={`/viewPost/CreatePost/userPost/post`}>
                            <div className='editButtonsContainer__visitButton'>Visit</div>
                        </Link>
                    </div>
                </div>

            </div>
                ))
                ) : (
                    <p className='userPost__nonePost'>There are any post saved</p>
                )}
                
            <h2 className='userPost__title'>Other Post</h2>  
            <div className='userPost__postContainer'>
                {postsSaved.map((post, index) => (
                    <div className='userPost__post' key={index}>
                        <div className='userPost__imgPost'>
                            <div className='userPost__iconsSection'>
                                <ion-icon className='userPost__create' name="create"></ion-icon>
                                <ion-icon className='userPost__link' name="link"></ion-icon>
                            </div>
                        </div>
                        <div className='userPost__textContainer'>
                            <h2 className='userPost__postTitle'>{post.title}</h2>
                            <h2 className='userPost__postContent'>{post.content}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>    
    );   
}   