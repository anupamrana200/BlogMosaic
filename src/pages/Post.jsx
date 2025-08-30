import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    const isAuthor = post && userData ? post.userId === (userData.$id || userData.id || userData._id) : false;

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                } else {
                    navigate("/");
                }
            }).finally(() => {
                setLoading(false);
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            try {
                const status = await appwriteService.deletePost(post.$id);
                if (status) {
                    await appwriteService.deleteFile(post.featuredImage);
                    toast.success("Post deleted successfully!");
                    navigate("/");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                toast.error("Failed to delete post. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading post...</p>
                </div>
            </div>
        );
    }

    return post ? (
        <div className="py-8">
            <Container>
                {/* Featured Image Section */}
                <div className="relative mb-8 bg-white rounded-2xl shadow-medium overflow-hidden border border-slate-100">
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className={`w-full h-64 sm:h-80 lg:h-96 object-cover transition-opacity duration-300 ${
                            imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={() => setImageLoading(false)}
                        onError={(e) => {
                            setImageLoading(false);
                            e.target.src = '/vite.svg';
                        }}
                    />

                    {/* Author Actions */}
                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="backdrop-blur-sm bg-white/90 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={deletePost}
                                className="backdrop-blur-sm bg-white/90 text-red-700 border border-red-200 hover:bg-red-50"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <article className="bg-white rounded-2xl shadow-medium border border-slate-100 overflow-hidden">
                    {/* Post Header */}
                    <div className="px-6 sm:px-8 lg:px-12 py-8 border-b border-slate-100">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                            {post.title}
                        </h1>
                        <div className="mt-4 flex items-center text-slate-500 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Published on {new Date(post.$createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>

                    {/* Post Content - LEFT ALIGNED */}
                    <div className="px-6 sm:px-8 lg:px-12 py-8">
                        <div className="prose prose-slate prose-lg max-w-none text-left">
                            <div className="tinymce-content">
                                {parse(post.content)}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Navigation */}
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Posts
                    </Button>
                </div>
            </Container>
        </div>
    ) : null;
}