import '../css/viewPost.css'
import Link from 'next/link';

export default async function ViewPost(){

    const posts = Array(10).fill({
        title:'Sample Text',
        content: 'Lorem ipsum dolor amet sit sample text, maximum text to word break.',
    })
    
    return (      
        <section class='viewPost'>

            <div class='viewPost__sectionTitle'>
                <h2 class='viewPost__title'>Your Posts</h2>
                <Link href='viewPost/CreatePost'>
                    <button class='viewPost__newPost'>New Post</button>
                </Link>
            </div>

            <div class='viewPost__postContainer'>
            {posts.map((post, index) => (
                    <div class='viewPost__post' key={index}>
                        <div class='viewPost__imgPost'>
                            <div class='viewPost__iconsSection'>
                                <ion-icon class='viewPost__create' name="create"></ion-icon>
                                <ion-icon class='viewPost__link' name="link"></ion-icon>
                            </div>
                        </div>
                        <div class='viewPost__textContainer'>
                            <h2 class='viewPost__postTitle'>{post.title}</h2>
                            <h2 class='viewPost__postContent'>{post.content}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );   
}   