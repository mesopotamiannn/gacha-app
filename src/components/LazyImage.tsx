import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    placeholderColor?: string;
    className?: string; // Allow passing standard class names
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    placeholderColor = '#1e293b', // Default dark slate color
    className,
    style,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setHasError(true);
    }, [src]);

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...style, // Merge passed styles (like width/height)
                backgroundColor: isLoaded ? 'transparent' : placeholderColor
            }}
        >
            {/* Skeleton / Loading State */}
            {!isLoaded && !hasError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${placeholderColor} 0%, #334155 50%, ${placeholderColor} 100%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    zIndex: 1
                }} />
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Default behavior, can be overridden by style prop
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    display: 'block' // Remove inline image spacing
                }}
                {...props}
            />

            <style>
                {`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                `}
            </style>
        </div>
    );
};
