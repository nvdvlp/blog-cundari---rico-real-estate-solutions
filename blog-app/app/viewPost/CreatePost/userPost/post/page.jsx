'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PostPage() {
    const router = useRouter();
    
    const [postDetails, setPostDetails] = useState(null);

    useEffect(() => {
        const savedPost = localStorage.getItem('selectedPost');
        if (savedPost) {
            setPostDetails(JSON.parse(savedPost));
        }
    }, []);

    if (!postDetails) {
        return <p>Loading post details...</p>;
    }

    return (
        <div>
            <h1>{postDetails.post_title}</h1>
            <img
                className='viewPost__img'
                src={postDetails.post_banner_img_b64}
                alt={postDetails.post_title}
                style={{ width: '100%', height: 'auto' }}
            />
            <p>{postDetails.post_desc}</p>
            <div dangerouslySetInnerHTML={{ __html: postDetails.post_html }} />
        </div>
    );
}