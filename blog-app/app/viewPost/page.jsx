import '../css/viewPost.css'
import Link from 'next/link';

export default async function ViewPost(){

    const posts = Array(10).fill({
        title:'Sample Text',
        content: 'Lorem ipsum dolor amet sit sample text, maximum text to word break.',
    })
    
    return (      
        <section>
            <div class='titleRow'>
                <h2 class='yourPost'>Your Posts</h2>
                <Link href='viewPost/CreatePost'>
                    <button class='createPostButtonA'>
                        Create Post
                    </button>
                </Link>
            </div>
            <section class='posts'>
            {posts.map((post, index) => (
                    <div className='post' key={index}>
                        {/* <img src={post.imageUrl} alt="" /> */}
                        <div className='lol'></div>
                        <div className='editVisit'>
                            <div className='black'>Edit</div>
                            <div className='white'>Visit</div>
                        </div>
                        <h2 className='sampleText'>{post.title}</h2>
                        <h2 className='content'>{post.content}</h2>
                    </div>
                ))}
            </section>
        </section>
    );   
}   