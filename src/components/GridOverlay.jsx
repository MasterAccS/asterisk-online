import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const GridOverlay = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  // Expose toggle function to parent component
  useImperativeHandle(ref, () => ({
    toggle: () => setIsVisible(prev => !prev),
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    isVisible
  }));

  useEffect(() => {
    // Check if we should show grid on load (URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const gridParam = urlParams.get('grid');
    
    if (gridParam === 'true') {
      setIsVisible(true);
    }
  }, []);

  // Only show in development environment
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isVisible) return null;

  // Generate horizontal grid lines (6 lines equally spaced)
  const horizontalLines = [
    { position: 0, label: 'Line 1 (0%)' },
    { position: 16.7, label: 'Line 2 (16.7%)' },
    { position: 33.3, label: 'Line 3 (33.3%)' },
    { position: 50, label: 'Line 4 (50% - Center)' },
    { position: 66.7, label: 'Line 5 (66.7%)' },
    { position: 83.3, label: 'Line 6 (83.3%)' }
  ];

  // Generate vertical grid columns (6 lines equally spaced)
  const verticalLines = [
    { position: 0, label: 'Column A (0%)' },
    { position: 16.7, label: 'Column B (16.7%)' },
    { position: 33.3, label: 'Column C (33.3%)' },
    { position: 50, label: 'Column D (50% - Center)' },
    { position: 66.7, label: 'Column E (66.7%)' },
    { position: 83.3, label: 'Column F (83.3%)' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {/* Horizontal grid lines */}
      {horizontalLines.map((line, index) => (
        <div
          key={`h-${index}`}
          style={{
            position: 'absolute',
            top: `${line.position}%`,
            left: 0,
            width: '100%',
            height: '1px',
            backgroundColor: line.position === 50 ? '#ff6b6b' : '#4ecdc4',
            opacity: 0.6
          }}
        >
          {/* Line label */}
          <div
            style={{
              position: 'absolute',
              left: '8px',
              top: '-12px',
              fontSize: '10px',
              color: line.position === 50 ? '#ff6b6b' : '#4ecdc4',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '2px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap'
            }}
          >
            {line.label}
          </div>
        </div>
      ))}

      {/* Vertical grid lines */}
      {verticalLines.map((line, index) => (
        <div
          key={`v-${index}`}
          style={{
            position: 'absolute',
            left: `${line.position}%`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: line.position === 50 ? '#ff6b6b' : '#4ecdc4',
            opacity: 0.6
          }}
        >
          {/* Line label */}
          <div
            style={{
              position: 'absolute',
              left: '-35px',
              top: '8px',
              fontSize: '10px',
              color: line.position === 50 ? '#ff6b6b' : '#4ecdc4',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '2px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              transform: 'rotate(-90deg)',
              transformOrigin: 'left center'
            }}
          >
            {line.label}
          </div>
        </div>
      ))}

      {/* Center crosshair at 50% intersection */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20px',
          height: '20px',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001
        }}
      >
        {/* Horizontal crosshair line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-40px',
            width: '80px',
            height: '2px',
            backgroundColor: '#ff6b6b',
            transform: 'translateY(-50%)'
          }}
        />
        {/* Vertical crosshair line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-40px',
            width: '2px',
            height: '80px',
            backgroundColor: '#ff6b6b',
            transform: 'translateX(-50%)'
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(255, 255, 255, 0.8)'
          }}
        />
      </div>

      {/* Toggle instruction */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          fontSize: '12px',
          color: '#4ecdc4',
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #4ecdc4'
        }}
      >
        Grid Overlay Active • Type '::grid' to toggle • ?grid=true
      </div>

      {/* Grid intersection markers for key points */}
      {[16.7, 50].map(h => 
        [50].map(v => (
          <div
            key={`marker-${h}-${v}`}
            style={{
              position: 'absolute',
              top: `${h}%`,
              left: `${v}%`,
              width: '8px',
              height: '8px',
              backgroundColor: '#ff6b6b',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.8,
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          />
        ))
      )}
    </div>
  );
});

export default GridOverlay;
