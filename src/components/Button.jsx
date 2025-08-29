import React from "react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    className = "",
    ...props
}) {
    
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/25 shadow-md hover:shadow-lg transform hover:scale-105",
        secondary: "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500/25 transform hover:scale-105",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500/25",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/25 shadow-md hover:shadow-lg transform hover:scale-105",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/25 shadow-md hover:shadow-lg transform hover:scale-105",
        outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-500/25"
    }
    
    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl"
    }
    
    const isDisabled = disabled || loading
    
    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            type={type}
            disabled={isDisabled}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}