// blog
import Link from "next/link"
import SearchInput from "../components/searchInput";

async function loadPostUrl(){
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const data = await res.json()
    console.log(data)
    return data
}

function inputValue({inputValue}){
    return (
        p
    )
}


export default async function Blog(){
    const posts = await loadPostUrl()
    console.log(posts);
    
    return(
        <section id="posts">
            <button>
                <Link href='/blog/CreatePost'>Create a Post</Link>
            </button>

            <SearchInput />

            <h2>There are the latest posts</h2>
            <article>
                {
                    posts.map(post => (
                        <div>
                            <h2>
                                <Link href={`/blog/${post.id}`}>
                                    {post.id}. {post.title}
                                </Link>
                                    <p>{post.body}</p>
                            </h2>
                        </div>
                    ))
                }
            </article>
        </section>
    )
}   