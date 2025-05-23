// components/FloatingTriangles.tsx
import React from 'react';

const FloatingTriangles: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 10 }).map((_, i) => {
        const size = Math.random() * 30 + 25; // 25–55px
        const left = Math.random() * 40;      // position from left
        const bottom = Math.random() * 60;    // position from bottom
        const delay = Math.random() * 2;      // animation delay

        return (
          <div
            key={i}
            className="absolute bg-purple-400 opacity-80 clip-triangle animate-triangle-float"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `${bottom}px`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingTriangles;
