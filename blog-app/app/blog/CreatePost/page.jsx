'use client';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { usePostContext } from '../../context/context.jsx'; 

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
],
};

const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image'];
//agregar post
export default function CreatePost() {
const [content, setContent] = useState('');
const { addPost } = usePostContext(); 

const handleSavePost = () => {
    if (content.trim()) {
    // Guardar el post usando el contexto
    addPost(content); 
      // Limpiar el editor
        setContent('');
    } else {
    alert('El post está vacío.');
    }
};

return (
    <div>
        <h2>Crear Nuevo Post</h2>
        <ReactQuill value={content} onChange={setContent} modules={modules} formats={formats} />
        <button onClick={handleSavePost} style={{ marginTop: '10px' }}>Guardar Post</button>
    </div>
);
}
