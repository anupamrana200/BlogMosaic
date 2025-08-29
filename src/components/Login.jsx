import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"
import toast from 'react-hot-toast'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const login = async(data) => {
        setError("")
        setIsLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                toast.success("Welcome back! Login successful.", { 
                    duration: 4000,
                    icon: '🎉'
                });
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError("Invalid email or password. Please check your credentials and try again.")
            toast.error("Login failed. Please try again.")
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
                            Welcome Back
                        </h1>
                        <p className="text-slate-600">
                            Sign in to continue your blogging journey
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

                        <form onSubmit={handleSubmit(login)} className="space-y-6">
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
                                placeholder="Enter your password"
                                required
                                error={errors.password?.message}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
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
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-slate-200"></div>
                            <span className="px-4 text-sm text-slate-500">or</span>
                            <div className="flex-1 border-t border-slate-200"></div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-slate-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    By signing in, you agree to our{' '}
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

export default Login