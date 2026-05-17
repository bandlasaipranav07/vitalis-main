import React from 'react';

interface VitalisLogoProps {
  className?: string;
  size?: number;
}

export default function VitalisLogo({ className, size = 24 }: VitalisLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 
        A flowing, hand-drawn 'V' shape inspired by the user's sketch.
        It features a small introductory wave and a long, graceful finishing stroke.
      */}
      <path
        d="M10 50 
           Q25 30 35 50 
           L55 85 
           Q75 10 90 25"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
