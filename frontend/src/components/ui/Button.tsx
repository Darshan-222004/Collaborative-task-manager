import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

/**
 * Reusable Button component with variant and size styles.
 * Supports loading state with spinner.
 * Enhanced with gradients and smooth animations.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        // Base styles with enhanced transitions and animations
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';

        // Variant-specific styles with gradients and modern colors
        const variants = {
            // Using standard indigo color to guarantee visibility if custom config fails
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:bg-indigo-800',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm border border-gray-200',
            outline: 'border-2 border-indigo-200 bg-transparent hover:bg-indigo-50 text-indigo-700 hover:border-indigo-300',
            ghost: 'hover:bg-gray-100 hover:text-gray-900 text-gray-600',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20',
        };

        // Size-specific styles
        const sizes = {
            sm: 'h-9 px-3 text-xs',
            md: 'h-11 px-5 py-2.5 text-sm',
            lg: 'h-13 px-8 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
