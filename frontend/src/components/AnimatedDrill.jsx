import React, { useState, useEffect, useRef } from 'react';
import RinkVisualizer from './RinkVisualizer';

const WIDTH = 50;
const HEIGHT = 100;

// Define the drill path points
const pathPoints = [
  { x: 13, y: 17 },  // Start
  { x: 25, y: 50 },  // Middle point (change direction)
  { x: 37, y: 40 },  // End
];

const segmentDuration = 1500; // duration per segment (ms)

function AnimatedDrill() {
  const [pos, setPos] = useState(pathPoints[0]);
  const segmentIndexRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    function animate(time) {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;

      const currentIndex = segmentIndexRef.current;
      const from = pathPoints[currentIndex];
      const to = pathPoints[currentIndex + 1];

      if (!to) {
        // End of path, stop animation
        setPos(pathPoints[pathPoints.length - 1]);
        return;
      }

      const progress = Math.min(elapsed / segmentDuration, 1);

      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;

      setPos({ x, y });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Move to next segment
        segmentIndexRef.current += 1;
        startTimeRef.current = null;
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', height: 'auto' }}>
      {/* Rink background */}
      <RinkVisualizer />

      {/* Draw the full path as a polyline */}
      <polyline
        points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
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
