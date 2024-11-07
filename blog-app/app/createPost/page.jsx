'use client';
import './CreatePost.css';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import updateDisplayName from '@/app/lib/updateDisplayName';
import createPost from '@/app/lib/createPost.js';
import Supabase from '../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
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

const supabase = createClient('https://ppxclfscuebswbjhjtcz.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNsZnNjdWVic3diamhqdGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3OTU5MjgsImV4cCI6MjA0NDM3MTkyOH0.WYUHZcJNDf1J9k1VNMpjKP_woxKS5CmHMoDFUPh2GI0'
);

// Agregar post
export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [draggedImage, setDraggedImage] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [posts, setPosts] = useState([]); // Define posts state
    const [loading, setLoading] = useState(true); // State for loading posts
    const [isSaving, setIsSaving] = useState(false);  // Loader for "Create Post" button
    const [isCancelling, setIsCancelling] = useState(false);  // Loader for "Cancel" button
    const router = useRouter(); 

    //estados para la creacion de los tags
    const [tags, setTags] = useState([]); // Todos los tags creados
    const [newTag,  setNewTag] = useState('') // Input para un nuevo tag
    const [selectedTags, setSelectedTags] = useState([]) // Tags seleccionados para el post

    useEffect(() => {
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
            const { data, error } = await Supabase
                .from('Posts')
                .select('*') 
                .order('created_at', { ascending: false }); 
    
            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
            setLoading(false);
        }

        async function fetchTags(){
            const {data, error } = await Supabase
            .from('Tags')
            .select('tag_name')

            if (error) {
                console.error('Error fetching tags:', error);
            } else {
                setTags(data.map(tag => tag.tag_name));
            }
        }
    
        fetchDisplayName();
        fetchPosts();
        fetchTags();
    }, []);

    //salvar post
    const  handleSavePost = async () => {
        setIsSaving(true);

        //el post solo atmite 20 caracteres en el titulo
        //el post tiene que contener imagen
        if (!draggedImage) {
            alert('Please upload an image before saving the post.');
            setIsSaving(false);
            return;
        }
        
        //contenido html del post NO puede estar vacio
        if (!content.trim()) {
            alert('The post content cannot be empty.');
            setIsSaving(false);
            return;
        }
            // Imprimir valores
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Image:', draggedImage);
        console.log('Content:', content);
        console.log('Tags:', selectedTags);

        // Guardar el post si los campos están llenos
        const { successMessage, error } = await createPost(title, description, draggedImage, content, selectedTags)
        if(error){
            alert("error creating the post"  + error.message)
            console.log(error)
        } else if(successMessage){
            console.log("Created successfully")
            setTitle('');
            setDescription('');
            setContent('');
            setDraggedImage(null);
            setTags([]) // rastrea los tags
            router.push('/post')
        }

        setIsSaving(false); 
    };

    const handleCancelPost = () => {
        setIsCancelling(true);  
        router.back();
        setIsCancelling(false);  
    };

    //arrastrar imagen 
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

    //dropear imagen 
    const handleDropImage = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload({ target: { files: [file] } });
    };

    //crear un nuevo tag
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
    
    //borrar tags
    const handleRemoveTag = (index) => { 
        setSelectedTags(selectedTags.filter((_, i) => i !== index));
    } 

    //seleccionar los tags desde la lista de tags
    const handleSelectTag = (tag) => {
        if(!selectedTags.includes(tag)){
            setSelectedTags([...selectedTags, tag]);
        }
    }

    return (
        <section className='createPost'>
            <h2 className='createPost__title'>Create Post</h2>
    
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
                        onChange={(e) => setDescription(e.target.value)}>
                    </textarea>
                </div>
            </div>
            
            <div className='createPost__tagContainer'>
                <div className='tagContainer__inputFields'>
                    {/* Creacion de tags */}
                    <div className='inputFields__addTagInput'>
                        <input 
                        type="text" 
                        placeholder='Add a new tag'
                        className='addTagInput__input'
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} //anadir tag al presionar
                        />
                        <ion-icon 
                        class='addTagInput__icon' 
                        name="add-outline"
                        onClick={handleAddTag} //anadir tag al clickear
                        ></ion-icon>   
                    </div> 

                    {/* Contenedor para tags seleccionados */}
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

                {/* Contenedor para todos los tags */}
                <div className='tagContainer__allTags'>
                    <h2 className='allTags__title'>All Tags</h2>
                    <div className='allTags__tagsContainer'>
                        {tags.length > 0 ? (
                            tags.map((tag, index) => (
                                <div 
                                    key={index}
                                    className='tagsContainer__tag all' 
                                    onClick={() => handleSelectTag(tag)}
                                >
                                    {tag}
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
                <h2 className='footer__writenby'>written by {displayName}</h2> 
                {/* <p>Created on: {createdAt}</p> */}
            </div>

            <div className='createPost__buttonContainer'>
                <button 
                    className='buttonContainer__createPostButton' 
                    onClick={handleSavePost} 
                    style={{ marginTop: '10px' }}
                    disabled={isSaving} 
                >
                    {isSaving ? 'Saving...' : 'Create Post'}
                </button>
                
                <button 
                    className='buttonContainer__cancelPostButton' 
                    onClick={handleCancelPost} 
                    disabled={isCancelling} 
                >
                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                </button>
            </div>
        </section>
    );
}
