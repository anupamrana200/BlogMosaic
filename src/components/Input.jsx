import React, {useId, useState} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    error = "",
    required = false,
    ...props
}, ref){
    const id = useId()
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
        <div className='w-full space-y-2'>
            {label && (
                <label 
                    className='block text-sm font-semibold text-slate-700 transition-colors duration-200'
                    htmlFor={id}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                <input
                    type={inputType}
                    className={`
                        w-full px-4 py-3 text-slate-800 bg-white border rounded-xl
                        transition-all duration-200 placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${error 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : isFocused 
                                ? 'border-indigo-300' 
                                : 'border-slate-200 hover:border-slate-300'
                        }
                        ${isPassword ? 'pr-12' : ''}
                        ${className}
                    `}
                    ref={ref}
                    {...props}
                    id={id}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                
                {/* Password Toggle Button */}
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
})

export default Input