import React, {useId, useState} from 'react'

function Select({
    label,
    options = [],
    className = "",
    error = "",
    required = false,
    ...props
}, ref) {
    const id = useId()
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className='w-full space-y-2'>
            {label && (
                <label 
                    htmlFor={id} 
                    className='block text-sm font-semibold text-slate-700 transition-colors duration-200'
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                <select 
                    id={id}
                    className={`
                        w-full px-4 py-3 text-slate-800 bg-white border rounded-xl appearance-none
                        transition-all duration-200 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${error 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : isFocused 
                                ? 'border-indigo-300' 
                                : 'border-slate-200 hover:border-slate-300'
                        }
                        ${className}
                    `}
                    ref={ref}
                    {...props}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                    <option value="" disabled>
                        Choose an option...
                    </option>
                    {options?.map((option) => (
                        <option key={option} value={option} className="py-2">
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </select>
                
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className={`w-5 h-5 transition-colors duration-200 ${
                        error ? 'text-red-400' : isFocused ? 'text-indigo-500' : 'text-slate-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
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
}

export default React.forwardRef(Select)