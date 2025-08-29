import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import {useSelector} from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading posts...</p>
                </div>
            </div>
        )
    }
  
    if (posts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-4">
                                Welcome to BlogMosaic
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                {authStatus 
                                    ? "No posts available yet. Be the first to share your thoughts!" 
                                    : "Discover amazing stories and insights from our community of writers."
                                }
                            </p>
                        </div>
                        
                        {!authStatus ? (
                            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Login to Read Posts
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200"
                                >
                                    Join Our Community
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/add-post')}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Create Your First Post
                            </button>
                        )}
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='py-12'>
            <Container>
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                        Latest Stories
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explore the newest posts from our community of passionate writers
                    </p>
                </div>

                {/* Posts Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id} className='group'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>

                {/* Load More Section (if needed in future) */}
                {posts.length > 12 && (
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transform hover:scale-105 transition-all duration-200">
                            Load More Posts
                        </button>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home