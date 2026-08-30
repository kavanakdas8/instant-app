import React from 'react';

export const Logo = ({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <mask id="camera-mask">
      <rect width="100" height="100" fill="white" />
      <circle cx="86" cy="18" r="22" fill="black" />
      <circle cx="50" cy="55" r="15" fill="black" />
    </mask>
    
    <rect x="14" y="28" width="72" height="54" rx="12" fill="currentColor" mask="url(#camera-mask)" />
    <circle cx="50" cy="55" r="7.5" fill="currentColor" />
    <path d="M 86 2 Q 86 18 70 18 Q 86 18 86 34 Q 86 18 102 18 Q 86 18 86 2 Z" fill="currentColor" />
  </svg>
);

export default Logo;
