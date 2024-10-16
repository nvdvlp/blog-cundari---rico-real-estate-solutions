'use client';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import '../../css/CreatePost.css';
import createPost from '@/app/lib/createPost.js';

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

// Agregar post
export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [draggedImage, setDraggedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para cargar
    const router = useRouter(); 

    const  handleSavePost = async () => {
        if (!title.trim()) {
            alert('The title post cannot be empty.');
            return;
        }

        if (!content.trim()) {
            alert('The post content cannot be empty.');
            return;
        }

        // Guardar el post si los campos están llenos
        const currentDate = new Date().toLocaleDateString();

        const newPost = {
            title,
            description,
            content,
            image: draggedImage,
            date: currentDate,
            socialMedia: {
                whatsapp: 'your-whatsapp-link',
                twitter: 'your-twitter-link',
                instagram: 'your-instagram-link',
                facebook: 'your-facebook-link'
            }
        };
        const { successMessage, error } = await createPost(title, description, draggedImage, content)

        if(error){
            alert("error creando post")
            console.log(error)
        } else if(successMessage){
            console.log("CREATED SUCCESFULLY")
            setTitle('');
            setDescription('');
            setContent('');
            setDraggedImage(null);
            router.push('/viewPost')
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const minWidth = 640;
                    const minHeight = 360;

                    if (img.width < minWidth || img.height < minHeight) {
                        const canvas = document.createElement('canvas');
                        let scaleFactor = Math.max(minWidth / img.width, minHeight / img.height);

                        canvas.width = img.width * scaleFactor;
                        canvas.height = img.height * scaleFactor;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        const resizedImage = canvas.toDataURL('image/jpeg');
                        setDraggedImage(resizedImage);
                        console.log("resizedImage")
                        console.log(resizedImage)
                    } else {
                        setDraggedImage(event.target.result);
                        console.log("resizedImage")
                        console.log(event.target.result)
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image.');
        }
    };

    const handleDropImage = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload({ target: { files: [file] } });
    };

    return (
        <section className='createPost'>
            <h2 className='createPost__title'>Create Post</h2>
    
            <div className='createPost__informationContainer'>
                <div 
                    className='informationContainer__dragAndDropZone'
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropImage}
                >
                    {draggedImage ? (
                        <img src={draggedImage} alt="Uploaded" />
                    ) : (
                        <>  
                            <div className='informationContainer__imgFolderContainer'>
                                <ion-icon class='imgFolderContainer__imgIcon' name="images"></ion-icon>
                                <p className='imgFolderContainer__dropText'>Drop an image or select a file</p>
                                <button className="imgFolderContainer__uploadButton" onClick={() => document.getElementById('imageInput').click()}>
                                    Select File
                                </button>
                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="fileInput" 
                                />
                            </div>
                            <p className='imgFolderContainer__warningMessage'>The image is recommended to be greater than 360*640px</p>
                        </>
                    )}
                </div>

                <div className='informationContainer__inputContainer'>
                    <h2 className='inputContainer__textInputPost'>Title</h2>
                    <input 
                        type="text" 
                        className='inputContainer__size1'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <h2 className='inputContainer__textInputPost'>Description (optional)</h2>
                    <textarea
                        className='inputContainer__size2'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}>
                    </textarea>
                </div>
            </div>
            
            <ReactQuill 
                className='reactQuill' 
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats} 
            />

            <div className='createPost__buttonContainer'>
                <button className='buttonContainer__createPostButton' onClick={handleSavePost} style={{ marginTop: '10px' }}>
                    Create Post
                </button>
                <button className='buttonContainer__cancelPostButton' onClick={() => router.back()}>
                    Cancel
                </button>
            </div>
        </section>
    );
}
