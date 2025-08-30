import React, { useState } from 'react'
import service from '../appwrite/config'
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage, $createdAt}) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = (e) => {
    setImageError(true)
    setImageLoading(false)
    e.target.src = '/vite.svg'
  }

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <Link to={`/post/${$id}`} className="block group h-full">
      <div className='h-full bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 relative'>
        {/* Image Container */}
        <div className='relative aspect-video overflow-hidden bg-slate-100'>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <img
            src={service.getFilePreview(featuredImage)}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className='p-6 pb-4 flex flex-col h-32'>
          <h2 className='text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 leading-tight flex-1'>
            {title}
          </h2>
          
          {/* Bottom section with Read more and Date */}
          <div className='mt-4 flex items-end justify-between'>
            {/* Read more indicator */}
            <div className='flex items-center text-sm text-indigo-600 font-medium group-hover:translate-x-1 transition-transform duration-200'>
              Read more
              <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </div>
            
            {/* Publish Date - Right Bottom */}
            <div className='text-xs text-slate-500 flex items-center'>
              <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              {formatDate($createdAt)}
            </div>
          </div>
        </div>

        {/* Decorative border */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  )
}

export default PostCard