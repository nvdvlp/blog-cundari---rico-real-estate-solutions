async function loadPost(id){
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await res.json()
    return data
}

//params change id name route dynamically
async function Page({params}){
    console.log(params);
    const post = await loadPost(params.paramsPostId)
    return(
        <div>
            <h1>{post.id}. {post.title}</h1>
            <p>{post.body}</p>
        </div>
    )
}

export default Page