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
        .modern-earth {
          position: relative;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(102, 126, 234, 0.3),
            inset 0 2px 8px rgba(255, 255, 255, 0.2),
            inset 0 -2px 8px rgba(0, 0, 0, 0.1);
          animation: earthRotate 20s linear infinite;
        }

        .modern-earth::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          animation: shimmer 8s linear infinite;
        }

        .earth-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #4f46e5, #7c3aed, #2563eb);
          animation: coreGlow 4s ease-in-out infinite alternate;
        }

        .continent {
          position: absolute;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          opacity: 0.8;
          animation: continentFloat 6s ease-in-out infinite;
        }

        .continent:nth-child(2) {
          top: 20%;
          left: 15%;
          width: 25%;
          height: 15%;
          animation-delay: -1s;
        }

        .continent:nth-child(3) {
          top: 40%;
          right: 20%;
          width: 20%;
          height: 12%;
          animation-delay: -2s;
        }

        .continent:nth-child(4) {
          bottom: 25%;
          left: 25%;
          width: 18%;
          height: 10%;
          animation-delay: -3s;
        }

        .continent:nth-child(5) {
          top: 60%;
          right: 35%;
          width: 15%;
          height: 8%;
          animation-delay: -4s;
        }

        .orbital-ring {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          border: 2px solid rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          border-top-color: rgba(102, 126, 234, 0.6);
          animation: orbit 15s linear infinite;
        }

        .data-stream {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #06b6d4;
          border-radius: 50%;
          opacity: 0;
          animation: dataFlow 3s linear infinite;
        }

        .data-stream:nth-child(7) {
          top: 30%;
          left: 10%;
          animation-delay: 0s;
        }

        .data-stream:nth-child(8) {
          top: 50%;
          right: 15%;
          animation-delay: -0.5s;
        }

        .data-stream:nth-child(9) {
          bottom: 30%;
          left: 30%;
          animation-delay: -1s;
        }

        .data-stream:nth-child(10) {
          top: 70%;
          right: 25%;
          animation-delay: -1.5s;
        }

        @keyframes earthRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes coreGlow {
          0% { 
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.4);
            transform: translate(-50%, -50%) scale(1);
          }
          100% { 
            box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes continentFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes dataFlow {
          0% { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.5); 
          }
        }
      `}</style>
      
      <div className={`modern-earth ${sizeClasses[size]} ${className}`}>
        <div className="earth-core"></div>
        <div className="continent"></div>
        <div className="continent"></div>
        <div className="continent"></div>
        <div className="continent"></div>
        <div className="orbital-ring"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
      </div>
    </>
  );
};

export default EarthLoader; 