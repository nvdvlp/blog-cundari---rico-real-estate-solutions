// blog
import Link from "next/link"

async function loadPostUrl(){
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const data = await res.json()
    console.log(data)
    return data
}

export default async function Blog(){

    const posts = await loadPostUrl()
    console.log(posts);
    
    return(
        <section id="posts">
            <button>
                <Link href='/blog/CreatePost'>Create a Post</Link>
            </button>
            <h2>There are the latest posts</h2>
            <article>
                {
                    posts.map(post => (
                        <div>
                            <p>{post.id}</p>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </div>
                    ))
                }
            </article>
        </section>
    )
}   