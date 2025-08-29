import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function PostForm({ post }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    const submit = async (data) => {
        // Check if user is authenticated
        if (!authStatus || !userData) {
            toast.error('You must be logged in to create a post.');
            navigate('/login');
            return;
        }

        setIsSubmitting(true)
        try {
            if (post) {
                // Update existing post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    toast.success("Post updated successfully!", { 
                        duration: 3000,
                        icon: '✅'
                    });
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Create new post
                let file;
                if (data.image && data.image[0]) {
                    file = await appwriteService.uploadFile(data.image[0]);
                }
            
                if (file && file.$id) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    
                    // Get user ID - try different possible property names
                    const userId = userData.$id || userData.id || userData._id;
                    
                    if (!userId) {
                        console.error('User data:', userData);
                        toast.error('Unable to identify user. Please try logging out and logging back in.');
                        return;
                    }
                    
                    const dbPost = await appwriteService.createPost({ 
                        ...data, 
                        userId: userId 
                    });
                
                    if (dbPost) {
                        toast.success("Post created successfully!", { 
                            duration: 3000,
                            icon: '🎉'
                        });
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else if (!data.image || !data.image[0]) {
                    toast.error('Please select an image to upload.');
                } else {
                    toast.error('Image upload failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false)
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <p className="text-xl text-slate-600">
                        {post ? 'Update your story and share it with the world' : 'Share your thoughts and stories with the community'}
                    </p>
                </div>

                {/* Debug info - remove this after fixing
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Debug Info:</strong> User Status: {authStatus ? 'Authenticated' : 'Not Authenticated'}, 
                            User Data: {userData ? 'Available' : 'Missing'}
                            {userData && (
                                <span>, User ID: {userData.$id || userData.id || userData._id || 'Not Found'}</span>
                            )}
                        </p>
                    </div>
                )} */}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-strong border border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit(submit)} className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content - Left Side */}
                            <div className="lg:col-span-2 space-y-6">
                                <Input
                                    label="Post Title"
                                    placeholder="Enter an engaging title for your post"
                                    required
                                    error={errors.title?.message}
                                    {...register("title", { 
                                        required: "Title is required",
                                        minLength: {
                                            value: 5,
                                            message: "Title must be at least 5 characters"
                                        }
                                    })}
                                />

                                <Input
                                    label="URL Slug"
                                    placeholder="auto-generated-from-title"
                                    required
                                    error={errors.slug?.message}
                                    {...register("slug", { 
                                        required: "Slug is required",
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message: "Slug can only contain lowercase letters, numbers, and hyphens"
                                        }
                                    })}
                                    onInput={(e) => {
                                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                    }}
                                />

                                {/* Rich Text Editor */}
                                <div>
                                    <RTE 
                                        label="Content" 
                                        name="content" 
                                        control={control} 
                                        defaultValue={getValues("content")} 
                                    />
                                </div>
                            </div>

                            {/* Sidebar - Right Side */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Featured Image */}
                                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-800">Featured Image</h3>
                                    
                                    <Input
                                        label="Upload Image"
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg, image/gif"
                                        error={errors.image?.message}
                                        {...register("image", { 
                                            required: !post ? "Featured image is required" : false 
                                        })}
                                    />

                                    {post && post.featuredImage && (
                                        <div className="mt-4">
                                            <p className="text-sm text-slate-600 mb-2">Current Image:</p>
                                            <img
                                                src={appwriteService.getFilePreview(post.featuredImage)}
                                                alt={post.title}
                                                className="w-full h-48 object-cover rounded-lg border border-slate-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Post Settings */}
                                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-800">Post Settings</h3>
                                    
                                    <Select
                                        options={["active", "inactive"]}
                                        label="Publication Status"
                                        required
                                        error={errors.status?.message}
                                        {...register("status", { required: "Status is required" })}
                                    />

                                    <div className="pt-4 space-y-3">
                                        <Button
                                            type="submit"
                                            variant={post ? "success" : "primary"}
                                            size="lg"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        >
                                            {isSubmitting 
                                                ? (post ? 'Updating...' : 'Publishing...') 
                                                : (post ? 'Update Post' : 'Publish Post')
                                            }
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="w-full"
                                            onClick={() => navigate(-1)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>

                                {/* Post Preview Info */}
                                <div className="bg-indigo-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-indigo-800 mb-3">💡 Tips</h3>
                                    <ul className="text-sm text-indigo-700 space-y-2">
                                        <li>• Use an engaging title to attract readers</li>
                                        <li>• Choose a high-quality featured image</li>
                                        <li>• Write compelling content with proper formatting</li>
                                        <li>• Preview before publishing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}