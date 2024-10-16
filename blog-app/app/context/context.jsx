//post send logic
"use client"
import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
const [posts, setPosts] = useState([]);

const addPost = (postContent) => {
    setPosts((prevPosts) => [...prevPosts, postContent]);
};

return (
    <PostContext.Provider value={{ posts, addPost }}>
    {children}
    </PostContext.Provider>
);
};