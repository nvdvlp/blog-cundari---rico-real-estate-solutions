// blog
'use client';
import Link from "next/link"
import SearchInput from "../components/searchInput";
import { usePostContext } from '../context/context';

// Api json placeholder to add post
// async function loadPostUrl(){
//     const res = await fetch("https://jsonplaceholder.typicode.com/posts")
//     const data = await res.json()
//     console.log(data)
//     return data
// }

export default async function Blog(){
    const { posts } = usePostContext();

    return (
        <div>
        <h2>Posts</h2>
            <button>
                <Link href='/blog/CreatePost'>Create a Post</Link>
                </button>
        {posts.length > 0 ? (
            posts.map((post, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
                <h4>Post {index + 1}</h4>
                <div dangerouslySetInnerHTML={{ __html: post }} />
            </div>
            ))
        ) : (
            <p>No hay posts guardados.</p>
        )}
        </div>
    );   
    // const posts = await loadPostUrl()
    // console.log(posts);
    //         <button>
    //             <Link href='/blog/CreatePost'>Create a Post</Link>
    //         </button>
    
    // return(
    //     <section id="posts">

    //         <SearchInput />

    //         <h2>There are the latest posts</h2>
    //         <article>
    //             {
    //                 posts.map(post => (
    //                     <div>
    //                         <h2>
    //                             <Link href={`/blog/${post.id}`}>
    //                                 {post.id}. {post.title}
    //                             </Link>
    //                                 <p>{post.body}</p>
    //                         </h2>
    //                     </div>
    //                 ))
    //             }
    //         </article>
    //     </section>
    // )

}   