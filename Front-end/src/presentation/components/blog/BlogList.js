import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "./blogAPI"; 

const BlogList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getAllPosts();
            setPosts(data);
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {posts.map((post) => (
                    <div key={post._id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow">
                            <div className="d-flex justify-content-center">
                                <img 
                                    src={post.image} 
                                    className="card-img-top" 
                                    alt={post.title} 
                                    style={{ width: "80%", height: "auto", marginTop: "10px" }} 
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.description}</p>
                                <Link to={`${post._id}`} className="btn btn-primary">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
