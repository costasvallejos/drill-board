import React, { useState, useEffect, useRef } from 'react';
import RinkVisualizer from './RinkVisualizer';

const WIDTH = 50;
const HEIGHT = 100;

const figureEightPoints = [
  { x: 13, y: 83 },
  { x: 13, y: 17 },
  { x: 25, y: 50 },
  { x: 37, y: 17 },
  { x: 37, y: 83 },
  { x: 25, y: 50 },
];

const segmentDuration = 1200; // ms per segment

function AnimatedDrill({ path }) {
  const points = (Array.isArray(path) && path.length > 1) ? path : figureEightPoints;
  const [pos, setPos] = useState(points[0]);
  const segmentIndexRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    segmentIndexRef.current = 0;
    setPos(points[0]);
    startTimeRef.current = null;
    let animationFrame;
    function animate(time) {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const currentIndex = segmentIndexRef.current;
      const from = points[currentIndex];
      const to = points[currentIndex + 1];
      if (!to) {
        segmentIndexRef.current = 0;
        startTimeRef.current = null;
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / segmentDuration, 1);
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      setPos({ x, y });
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        segmentIndexRef.current += 1;
        startTimeRef.current = null;
        animationFrame = requestAnimationFrame(animate);
      }
    }
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);

  return (
    <svg
      key={JSON.stringify(points)}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', maxWidth: '400px', minWidth: '250px', height: 'auto', flex: '0 1 400px' }}
    >
      <RinkVisualizer />
      <polyline
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="black"
        strokeWidth="0.3"
        strokeDasharray="2,2"
      />
      <circle cx={pos.x} cy={pos.y} r="1.5" fill="red" />
    </svg>
  );
}

export default AnimatedDrill;
