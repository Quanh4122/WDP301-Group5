import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Autoformat, AutoImage, Autosave, BlockQuote, Bold, CKBox, CKBoxImageEdit, CloudServices, Emoji, Essentials, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, MediaEmbed, Mention, Paragraph, PasteFromOffice, PictureEditing, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, TextTransformation, TodoList, Underline } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { useState, ChangeEvent, FormEvent } from 'react';
import postBlog from '../blog/blogAPI'

const CreateBlog = () => {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        content: ''
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const blogData = {
            title: formData.title,
            description: formData.description,
            dateCreate: new Date(),
            author: "67bb8e06a5fe4f4fe85dc19f",
            image: formData.image,
            content: formData.content
        };
        postBlog(blogData)
        console.log("Submitted blog data:", blogData)
    }

    return (
        <div className='container' style={{
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingBottom: '100px' 
        }}>
            <form onSubmit={handleSubmit}>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className='col'>
                        <label style={{ fontWeight: 'bold' }}>Title: </label><br />
                        <input
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                </div>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className='col'>
                        <label style={{ fontWeight: 'bold' }}>Description: </label><br />
                        <input
                            type='text'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                </div>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className='col'>
                        <label style={{ fontWeight: 'bold' }}>Image link: </label><br />
                        <input
                            type='text'
                            name='image'
                            value={formData.image}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                </div>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className='col'>
                        <label style={{ fontWeight: 'bold' }}>Content: </label><br />
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                licenseKey: 'GPL',
                                plugins: [
                                    Autoformat, AutoImage, Autosave, BlockQuote, Bold, CKBox, CKBoxImageEdit,
                                    CloudServices, Emoji, Essentials, Heading, ImageBlock, ImageCaption, ImageInline,
                                    ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
                                    ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List,
                                    ListProperties, MediaEmbed, Mention, Paragraph, PasteFromOffice, PictureEditing,
                                    Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties,
                                    TableToolbar, TextTransformation, TodoList, Underline
                                ],
                                toolbar: [
                                    'heading', '|', 'bold', 'italic', 'underline', '|',
                                    'emoji', 'link', 'insertImage', 'ckbox', 'insertTable',
                                    'blockQuote', '|', 'bulletedList', 'numberedList', 'todoList',
                                    'outdent', 'indent'
                                ],
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setFormData({...formData, content : data})
                            }}
                        />
                    </div>
                </div>

                <div className='row' style={{ textAlign: 'center', marginTop: '20px' }}>
                    <div className='col'>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateBlog;
