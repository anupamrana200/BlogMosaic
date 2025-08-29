import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await appwriteService.getPosts([])
                if (response) {
                    setPosts(response.documents)
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
                setError("Failed to load posts. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600 font-medium">Loading all posts...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            No Posts Yet
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            It looks like there aren't any posts to display right now. Be the first to share your story!
                        </p>
                        <button
                            onClick={() => window.location.href = '/add-post'}
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Create Your First Post
                        </button>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='py-12'>
            <Container>
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                        My Posts
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Discover all the amazing stories shared by our community
                    </p>
                    <div className="mt-6 flex items-center justify-center">
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'} Found
                        </span>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id} className='group animate-fade-in'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>

                {/* Load More Section (for future pagination) */}
                {posts.length >= 12 && (
                    <div className="text-center mt-16">
                        <p className="text-slate-500 mb-4">Showing all {posts.length} posts</p>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts