'use client';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { usePostContext } from '../../context/context.jsx'; 
import './CreatePost.css'

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
        console.log(content);
      // Limpiar el editor
        setContent('');
    } else {
    alert('El post está vacío.');
    }
};

// const handleDownloadHTML = () => {
//     const html = new Blob([content], { type: 'text/html' });
//     const url = window.URL.createObjectURL(html);

//     //Enlace temporal para la descarga del html
//     const a = document.createElement('a');
//     a.href = url;
//     //nombre del archivo 
//     a.download = 'post.html';
//     //agrega el enlace al DOM
//     document.body.appendChild(a);
//     a.click();
//     //quita el enlace al DOM
//     document.body.removeChild(a);

//     //liberar el objeto URL
//     window.URL.revokeObjectURL(url);
// }

return (
    <section>
        <h2 class='createPost'>Create Post</h2>
        <div class='rowPost'>
            <img src="/noneImage.png" alt="" />
            <div class='inputContainer'>
                <h2 class='textInputPost'>Title</h2>
                <input type="text" class='size1'/>
                <h2 class='textInputPost'>Description (optional)</h2>
                <input type="text" class='size2'/>
            </div>
        </div>
        <ReactQuill class='reactQuill' 
        value={content} onChange={setContent} modules={modules} formats={formats} />

        <div class='buttonContainer'>
            <button class='createPostButton' onClick={handleSavePost} style={{ marginTop: '10px' }}>
                Create Post
            </button>
            <button class='cancelPost'>Cancel</button>
            {/* <button onClick={handleDownloadHTML}>descargar HTML</button> */}
        </div>

        {/* <div style={{ marginTop: '20px' }}>
            <h3>Vista previa:</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div> */}
    </section>
    );
}
