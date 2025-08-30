import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const userData = useSelector((state) => state.auth.userData)
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true)
                
                // Check if user is authenticated
                if (!authStatus || !userData) {
                    navigate('/login')
                    return
                }

                // Get user ID - try different possible property names
                const userId = userData.$id || userData.id || userData._id
                
                if (!userId) {
                    setError("Unable to identify user. Please try logging out and logging back in.")
                    return
                }

                // Get posts only from the current user
                const response = await appwriteService.getPosts([
                    // This assumes your getPosts method can accept a query filter
                    // If not, we'll filter the results after fetching
                ])
                
                if (response) {
                    // Filter posts to show only current user's posts
                    const userPosts = response.documents.filter(post => post.userId === userId)
                    setPosts(userPosts)
                }
            } catch (error) {
                console.error('Error fetching user posts:', error)
                setError("Failed to load your posts. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchUserPosts()
    }, [authStatus, userData, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600 font-medium">Loading your posts...</p>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            No Posts Yet
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            You haven't created any posts yet. Start sharing your thoughts and stories with the community!
                        </p>
                        <button
                            onClick={() => navigate('/add-post')}
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Write Your First Post
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
                        Manage and view all the posts you've shared with the community
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                        </span>
                        <button
                            onClick={() => navigate('/add-post')}
                            className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors duration-200"
                        >
                            + Create New
                        </button>
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

                {/* Stats Section */}
                {posts.length >= 3 && (
                    <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Great work!</h3>
                            <p className="text-slate-600">
                                You've shared {posts.length} posts with the community. Keep writing and inspiring others!
                            </p>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts