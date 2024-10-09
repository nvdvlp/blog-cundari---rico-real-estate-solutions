'use client';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { usePostContext } from '../context/context.jsx'; 
import { useRouter } from 'next/navigation'; 
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

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image'
];

//agregar post
export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [draggedImage, setDraggedImage] = useState(null)
    const { addPost } = usePostContext(); 
    const router = useRouter(); 

    const handleSavePost = () => {
        if (!title.trim()) {
            alert('The title post cannot be empty.');
            return;
        }

        if (!content.trim()) {
            alert('The post content cannot be empty.');
            return;
        }

        // guardar el post si los campos están llenos
        const newPost = {
            title,
            description,
            content,
            image: draggedImage
        };
        
        addPost(newPost);
        console.log(newPost);

        // limpa los campos
        setTitle('');
        setDescription('');
        setContent('');
        setDraggedImage(null);

        // path blog
        router.push('/blog');
    };

    const handleDragImage = (e) =>{
        e.preventDefault();
    }

    const handleDropImage = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                console.log(img.src);
                img.onload = () => {
                    console.log("img loaded");
                    const minWidth = 640; 
                    const minHeight = 360; 

                    console.log("image dimensions:", img.width, img.height);
                    if (img.width < minWidth || img.height < minHeight) {
                        alert(`The image must be at least ${minWidth}px wide and ${minHeight}px tall.`);
                    } else {
                        // Si la imagen cumple con las dimensiones, se establece en el estado
                        setDraggedImage(event.target.result);
                        console.log("Imagen válida, actualizada en el estado.");
                    }
                };
            };
            // archivo cargado y guardado en base64
            reader.readAsDataURL(file);
        } else {
            alert('Please drag a valid image.');
            console.error('please upload a valid image file');
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

                <div
                className='drag-and-drop-zone'
                onDragOver={handleDragImage}
                onDrop={handleDropImage}
                >
                {draggedImage ? (
                            <img src={draggedImage} alt="Uploaded"/>
                        ) : (
                            <p class='dropText'>Drop your Post Image</p>
                        )}
                </div> 

                <div class='inputContainer'>
                    <h2 class='textInputPost'>Title</h2>
                    <input 
                    type="text" 
                    class='size1'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                    <h2 class='textInputPost'>Description (optional)</h2>
                    <textarea
                    class='size2'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}>
                    </textarea>
                </div>
            </div>
            
            <ReactQuill class='reactQuill' 
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats} 
            />

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
