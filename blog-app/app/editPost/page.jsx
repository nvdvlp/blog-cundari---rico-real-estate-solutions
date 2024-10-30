'use client';
import './EditPost.css';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import updatePost from '../lib/updatePost';
import updateDisplayName from '@/app/lib/updateDisplayName';
import { createClient } from '@supabase/supabase-js';

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
    const [displayName, setDisplayName] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [posts, setPosts] = useState([]); // Estado para almacenar todos los posts
    const [loading, setLoading] = useState(true); 
    const supabase = createClient('https://ppxclfscuebswbjhjtcz.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNsZnNjdWVic3diamhqdGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3OTU5MjgsImV4cCI6MjA0NDM3MTkyOH0.WYUHZcJNDf1J9k1VNMpjKP_woxKS5CmHMoDFUPh2GI0'
    );
    const [selectedTags, setSelectedTags] = useState([])
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const post = JSON.parse(localStorage.getItem('selectedPost'));
            console.log(post)
            if (post) {
                setTitle(post.post_title);
                setDescription(post.post_desc);
                setContent(post.post_html);
                setDraggedImage(post.post_banner_img_b64);
                setSelectedTags(post.tags);
                setCreatedAt(new Date(post.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }));
            }
        }
        
        async function fetchDisplayName() {
            const userId = 'a5f3ed09-60e3-4454-884c-1541fe11920a'; // UID del usuario
            const newDisplayName = 'Guillermo Rico'; // nombre del usuario
            const result = await updateDisplayName(userId, newDisplayName);
            
            if (!result.error) {
                setDisplayName(newDisplayName); 
                console.log(result.successMessage);
            } else {
                console.error(result.error);
            }
        }
    
        async function fetchPosts() {
            setLoading(true);
            const { data, error } = await supabase
                .from('Posts')
                .select('*') 
                .order('created_at', { ascending: false }); 
    
            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
        }

        async function fetchAllTags() {
            const { data, error } = await supabase
                .from('Tags') // Asegúrate de que esta tabla exista y contenga los tags
                .select('*');
        
            if (error) {
                console.error('Error fetching tags:', error);
            } else {
                setAllTags(data); // Establece los tags disponibles
            }
        }

        fetchDisplayName();
        fetchPosts();
        fetchAllTags();
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
        }, selectedTags);

        if (error) {
            alert(`${error.message}`);
            console.log(error);
        } 
        else if (successMessage) {
            console.log("Edited SUCCESSFULLY");
            setTitle('');
            setDescription('');
            setContent('');
            setDraggedImage(null);
            setTags([]); // Limpiar tags
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

    const handleAddTag = async () => {
        const trimmedTag = newTag.trim();
        if (!trimmedTag || tags.includes(trimmedTag)) return;

        // Añadir a Supabase si no existe
        const { data, error } = await Supabase
            .from('Tags')
            .insert([{ tag_name: trimmedTag }])
            .select();
    
        if (error) {
            console.error('Error adding tag:', error);
        } else {
            setTags([...tags, trimmedTag]);
            setSelectedTags([...selectedTags, trimmedTag]);
        }
        setNewTag('');
        
        // if(trimmedTag.trim() && !tags.includes(trimmedTag)){
        //     setTags([...tags, trimmedTag]);
        //     setSelectedTags([...selectedTags, trimmedTag]);
        // }else if (!selectedTags.includes(trimmedTag)){
        //     setSelectedTags([...selectedTags, trimmedTag])
        // }
    }

    const handleRemoveTag = (index) => { 
        setSelectedTags(selectedTags.filter((_, i) => i !== index));
    } 

    const handleSelectTag = (tag) => {
        if(!selectedTags.includes(tag)){
            setSelectedTags([...selectedTags, tag]);
        }
    }

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
                            <img src={draggedImage} alt="Uploaded" />
                        ) : (
                            <>  
                                <div className='informationContainer__imgFolderContainer'>
                                    <ion-icon class='imgFolderContainer__imgIcon' name="images"></ion-icon>
                                    <p className='imgFolderContainer__dropText'>Drop an image or select a file</p>
                                    <button 
                                        className="imgFolderContainer__uploadButton" 
                                        onClick={() => document.getElementById('imageInput').click()}
                                    >
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
                                <p className='imgFolderContainer__warningMessage'>It is recommended that the image be larger than 360*640px</p>
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
                    <h2 className='inputContainer__textInputPost'>Description (optional)</h2>
                    <textarea
                        className='inputContainer__size2'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className='createPost__tagContainer'>
                <div className='tagContainer__inputFields'>
                    <div className='inputFields__addTagInput'>
                        <input 
                            type="text" 
                            placeholder='Add a new tag'
                            className='addTagInput__input'
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                        <ion-icon class='addTagInput__icon' name="add-outline" onClick={handleAddTag}></ion-icon>
                    </div> 
                    <div className='tagContainer__tagsSelected'>
                    {selectedTags.length > 0 ? (
                        selectedTags.map((tag, index) => (
                            <div key={index} className='tagsContainer__tag'>
                                {tag}
                                <span className='tag__deleteTag' onClick={() => handleRemoveTag(index)}>x</span>
                            </div>
                        ))
                        ) : (
                            <p>No tags created or selected.</p>
                        )}
                    </div>                    
                </div>
                

                <div className='tagContainer__allTags'>
                    <h2 className='allTags__title'>All Tags</h2>
                    <div className='allTags__tagsContainer'>
                        {allTags.length > 0 ? (
                            allTags.map((tag) => (
                                <div 
                                    key={tag.id} // Asegúrate de que cada tag tenga un id único
                                    className='tagsContainer__tag all' 
                                    onClick={() => handleSelectTag(tag.tag_name)} // Usar el nombre o el id según tu estructura
                                >
                                    {tag.tag_name}
                                </div>
                            ))
                        ) : (
                            <p>No tags available.</p>
                        )}
                    </div>
                </div>
            </div>

            <ReactQuill 
                className='react-quill' 
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats} 
            />

            <div className='createPost__footer'>
                <h2 className='footer__writtenby'>written by {displayName}</h2> 
                <p className='footer__writtenby'>Created on: {createdAt}</p>
            </div>

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
