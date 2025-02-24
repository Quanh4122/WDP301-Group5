import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import {getBlogDetail} from './blogAPI'

const BlogDetail = () => {

    const { postId  } = useParams();
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogData = await getBlogDetail(postId);
                setBlog(blogData);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [postId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container text-center mt-5">
                <h2 className="text-danger">Blog not found!</h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h1 className="card-title text-center mb-3">{blog.title}</h1>
                    <p className="card-text text-center text-muted">{blog.description}</p>

                    <div className="text-center my-4 d-flex justify-content-center">
                        <img
                            src={blog.image}
                            alt="Blog"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                        />
                    </div>

                    <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

                    <hr className="my-4" />

                    <p className="text-muted text-center">
                        <strong>Author:</strong> {blog.author} | <strong>Date:</strong>{" "}
                        {new Date(blog.dateCreate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    )
}


export default BlogDetail