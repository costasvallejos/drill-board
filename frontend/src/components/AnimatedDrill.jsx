import React, { useState, useEffect, useRef } from 'react';
import RinkVisualizer from './RinkVisualizer';

// Use rink constants from your constants file or define them here
const WIDTH = 50;
const HEIGHT = 100;

// The figure eight path moving through rink dots
const figureEightPoints = [
  { x: 13, y: 83 },  // bottom-left dot
  { x: 13, y: 17 },  // top-left dot
  { x: 25, y: 50 },  // center dot
  { x: 37, y: 17 },  // top-right dot
  { x: 37, y: 83 },  // bottom-right dot
  { x: 25, y: 50 },  // center dot (return)
];

const segmentDuration = 1200; // ms per segment

function AnimatedDrill() {
  const [pos, setPos] = useState(figureEightPoints[0]);
  const segmentIndexRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    function animate(time) {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;

      const currentIndex = segmentIndexRef.current;
      const from = figureEightPoints[currentIndex];
      const to = figureEightPoints[currentIndex + 1];

      if (!to) {
        // Loop back to start
        segmentIndexRef.current = 0;
        startTimeRef.current = null;
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / segmentDuration, 1);

      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;

      setPos({ x, y });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        segmentIndexRef.current += 1;
        startTimeRef.current = null;
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', height: 'auto' }}>
      <RinkVisualizer />

      {/* Draw polyline for the path */}
      <polyline
        points={figureEightPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="black"
        strokeWidth="0.3"
        strokeDasharray="2,2"
      />

      {/* Player dot */}
      <circle cx={pos.x} cy={pos.y} r="1.5" fill="red" />
    </svg>
  );
}

export default AnimatedDrill;
