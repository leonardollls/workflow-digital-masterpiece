import React from 'react';

interface EarthLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const EarthLoader: React.FC<EarthLoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <>
      <style>{`
        .earth-loader {
          --watercolor: #3344c1;
          --landcolor: #7cc133;
          background-color: var(--watercolor);
          position: relative;
          overflow: hidden;
          border-radius: 50%;
          box-shadow:
            inset 0em 0.5em rgb(255, 255, 255, 0.25),
            inset 0em -0.5em rgb(0, 0, 0, 0.25);
          border: solid 0.15em white;
          animation: startround 1s;
          animation-iteration-count: 1;
        }

        .earth-loader svg:nth-child(1) {
          position: absolute;
          bottom: -50%;
          width: 100%;
          height: auto;
          animation: round1 5s infinite linear 0.75s;
        }

        .earth-loader svg:nth-child(2) {
          position: absolute;
          top: -60%;
          width: 100%;
          height: auto;
          animation: round1 5s infinite linear;
        }
        
        .earth-loader svg:nth-child(3) {
          position: absolute;
          top: -50%;
          width: 100%;
          height: auto;
          animation: round2 5s infinite linear;
        }
        
        .earth-loader svg:nth-child(4) {
          position: absolute;
          bottom: -44%;
          width: 100%;
          height: auto;
          animation: round2 5s infinite linear 0.75s;
        }

        @keyframes startround {
          0% {
            filter: brightness(500%);
            box-shadow: none;
          }
          75% {
            filter: brightness(500%);
            box-shadow: none;
          }
          100% {
            filter: brightness(100%);
            box-shadow:
              inset 0em 0.5em rgb(255, 255, 255, 0.25),
              inset 0em -0.5em rgb(0, 0, 0, 0.25);
          }
        }

        @keyframes round1 {
          0% {
            left: -50%;
            opacity: 100%;
            transform: skewX(0deg) rotate(0deg);
          }
          30% {
            left: -120%;
            opacity: 100%;
            transform: skewX(-25deg) rotate(25deg);
          }
          31% {
            left: -120%;
            opacity: 0%;
            transform: skewX(-25deg) rotate(25deg);
          }
          35% {
            left: 140%;
            opacity: 0%;
            transform: skewX(25deg) rotate(-25deg);
          }
          45% {
            left: 140%;
            opacity: 100%;
            transform: skewX(25deg) rotate(-25deg);
          }
          100% {
            left: -50%;
            opacity: 100%;
            transform: skewX(0deg) rotate(0deg);
          }
        }

        @keyframes round2 {
          0% {
            left: 100%;
            opacity: 100%;
            transform: skewX(0deg) rotate(0deg);
          }
          75% {
            left: -140%;
            opacity: 100%;
            transform: skewX(-25deg) rotate(25deg);
          }
          76% {
            left: -140%;
            opacity: 0%;
            transform: skewX(-25deg) rotate(25deg);
          }
          77% {
            left: 160%;
            opacity: 0%;
            transform: skewX(25deg) rotate(-25deg);
          }
          80% {
            left: 160%;
            opacity: 100%;
            transform: skewX(25deg) rotate(-25deg);
          }
          100% {
            left: 100%;
            opacity: 100%;
            transform: skewX(0deg) rotate(0deg);
          }
        }
      `}</style>
      
      <div className={`earth-loader ${sizeClasses[size]} ${className}`}>
        {/* Continents SVG shapes */}
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 C 15 15, 25 15, 30 20 L 35 25 C 30 30, 20 30, 15 25 Z" fill="var(--landcolor)" />
          <path d="M40 15 C 45 10, 55 10, 60 15 L 65 20 C 60 25, 50 25, 45 20 Z" fill="var(--landcolor)" />
        </svg>
        
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 25 C 12 20, 22 20, 28 25 L 32 30 C 28 35, 18 35, 12 30 Z" fill="var(--landcolor)" />
          <path d="M45 20 C 52 15, 62 15, 68 20 L 72 25 C 68 30, 58 30, 52 25 Z" fill="var(--landcolor)" />
        </svg>
        
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 30 C 15 25, 25 25, 32 30 L 36 35 C 32 40, 22 40, 15 35 Z" fill="var(--landcolor)" />
          <path d="M50 25 C 57 20, 67 20, 73 25 L 77 30 C 73 35, 63 35, 57 30 Z" fill="var(--landcolor)" />
        </svg>
        
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 35 C 18 30, 28 30, 34 35 L 38 40 C 34 45, 24 45, 18 40 Z" fill="var(--landcolor)" />
          <path d="M55 30 C 62 25, 72 25, 78 30 L 82 35 C 78 40, 68 40, 62 35 Z" fill="var(--landcolor)" />
        </svg>
      </div>
    </>
  );
};

export default EarthLoader; 