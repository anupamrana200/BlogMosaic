import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import toast from 'react-hot-toast'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()

    const create = async(data) => {
        setError("")
        setIsLoading(true)
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                toast.success("Welcome to BlogMosaic! Account created successfully.", { 
                    duration: 4000,
                    icon: '🎉'
                });
                const currentUser = await authService.getCurrentUser()
                if(currentUser) dispatch(login(currentUser));
                navigate("/")
            }
        } catch (error) {
            setError("Unable to create account. Please ensure your password is between 8-256 characters.")
            toast.error("Account creation failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4'>
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-strong border border-slate-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="mb-6">
                            <Logo width="80px" className="justify-center" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Join BlogMosaic
                        </h1>
                        <p className="text-slate-600">
                            Create your account and start sharing your stories
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pb-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(create)} className="space-y-6">
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                required
                                error={errors.name?.message}
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Name should only contain letters and spaces"
                                    }
                                })}
                            />

                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                                required
                                error={errors.email?.message}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a strong password"
                                required
                                error={errors.password?.message}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    },
                                    maxLength: {
                                        value: 256,
                                        message: "Password must be less than 256 characters"
                                    }
                                })}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-slate-200"></div>
                            <span className="px-4 text-sm text-slate-500">or</span>
                            <div className="flex-1 border-t border-slate-200"></div>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-700">
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup