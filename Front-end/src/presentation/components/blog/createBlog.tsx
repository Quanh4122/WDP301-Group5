import { CKEditor } from '@ckeditor/ckeditor5-react';
import {ClassicEditor, Autoformat,AutoImage,Autosave,BlockQuote,Bold,CKBox,CKBoxImageEdit,CloudServices,Emoji,Essentials,Heading,ImageBlock,ImageCaption,ImageInline,ImageInsert,ImageInsertViaUrl,ImageResize,ImageStyle,ImageTextAlternative,ImageToolbar,ImageUpload,Indent,IndentBlock,Italic,Link,LinkImage,List,ListProperties,MediaEmbed,Mention,Paragraph,PasteFromOffice,PictureEditing,Table,TableCaption,TableCellProperties,TableColumnResize,TableProperties,TableToolbar,TextTransformation,TodoList,Underline} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const CreateBlog = () => {
    return (
        <div className='container' style={{
            height: '90vh',
            padding: '20px'
        }}>
            <form>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className='col'>
                        <label style={{ fontWeight: 'bold' }}>Title: </label><br />
                        <input 
                            type='text' 
                            name='title' 
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
                            name='imageLink' 
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
