'use client';
import './EditPost.css';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import updatePost from '../lib/updatePost';

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
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 
    'blockquote', 'list', 'bullet', 'link', 'image'
];


const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const maxWidth = 640;  // Tamaño máximo de ancho que deseas
                const scaleFactor = maxWidth / img.width;
                
                canvas.width = maxWidth;
                canvas.height = img.height * scaleFactor;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const resizedImage = canvas.toDataURL('image/jpeg');
                const quillEditor = document.querySelector('.ql-editor');
                
                quillEditor.focus();
                const range = quillEditor.getSelection();
                quillEditor.insertEmbed(range.index, 'image', resizedImage);
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image.');
    }
};

// Editar post
export default function EditPost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [draggedImage, setDraggedImage] = useState(null);
    const router = useRouter(); 

    useEffect(() => {
        const post = JSON.parse(localStorage.getItem('selectedPost'));
        setTitle(post.post_title);
        setDescription(post.post_desc);
        setContent(post.post_html);
        setDraggedImage(post.post_banner_img_b64);
    }, []);

    const handleSavePost = async () => {
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
        const postId = JSON.parse(localStorage.getItem('selectedPost')).post_id;
        
        const { successMessage, error } = await updatePost(postId, {
            post_title: title,
            post_desc: description,
            post_banner_img_b64: draggedImage,
            post_html: content
        });

        if (error) {
            alert("Error editing post");
            console.log(error);
        } else if (successMessage) {
            console.log("Edited SUCCESSFULLY");
            setTitle('');
            setDescription('');
            setContent('');
            setDraggedImage(null);
            router.push(`/post`);
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
                    } else {
                        setDraggedImage(event.target.result);
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
        <h2 className='createPost__title'>Edit Post</h2>
        <div className='createPost__informationContainer'>
            <div className='createPost__imgDropContainer'>
                <div 
                    className='informationContainer__dragAndDropZone'
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropImage}
                >
                    {draggedImage ? (
                        <>
                            <img src={draggedImage} alt="Uploaded" />
                        </>
                    ) : (
                        <>  
                            <div className='informationContainer__imgFolderContainer'>
                                <ion-icon class='imgFolderContainer__imgIcon' name="images"></ion-icon>
                                <p className='imgFolderContainer__dropText'>Drop an image or select a file</p>
                                <button 
                                    className="imgFolderContainer__uploadButton" 
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    Seleccionar Archivo
                                </button>
                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="fileInput" 
                                />
                            </div>
                            <p className='imgFolderContainer__warningMessage'>It is recomends that the image be larger than 360*640px</p>
                        </>
                    )}
                </div>

                <div className="removeImageButtonContainer">
                        <button className='removeImageButtonContainer__removeImageButton'
                                            onClick={() => {
                                                setDraggedImage(null); 
                                                document.getElementById('imageInput').value = ''; 
                                            }} 
                        >
                            <p className='removeImageButton__text'>remove loaded image</p>
                            <ion-icon class='removeImageButton__trashIcon' name="trash-outline"></ion-icon>
                        </button>
                </div>
            </div>

            <div className='informationContainer__inputContainer'>
                <h2 className='inputContainer__textInputPost'>Title</h2>
                <input 
                    type="text" 
                    className='inputContainer__size1'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <h2 className='inputContainer__textInputPost'>Description (opcional)</h2>
                <textarea
                    className='inputContainer__size2'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>
        
        <ReactQuill 
            className='react-quill' 
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats} 
        />

        <div className='createPost__buttonContainer'>
            <button 
                className='buttonContainer__createPostButton' 
                onClick={handleSavePost} 
                style={{ marginTop: '10px' }}
            >
                Edit Post
            </button>
            <button className='buttonContainer__cancelPostButton' onClick={() => router.back()}>
                Cancel
            </button>
        </div>
    </section>
    );
}
