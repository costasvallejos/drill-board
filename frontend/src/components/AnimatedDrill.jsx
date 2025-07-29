import React, { useState, useEffect, useRef } from 'react';
import RinkVisualizer from './RinkVisualizer';

const WIDTH = 50;
const HEIGHT = 100;
const PLAYER_RADIUS = 1.5;
const PUCK_RADIUS = 1;
const PLAYER2_RADIUS = 1.5;

const figureEightPoints = [
  { x: 13, y: 83 },
  { x: 13, y: 17 },
  { x: 25, y: 50 },
  { x: 37, y: 17 },
  { x: 37, y: 83 },
  { x: 25, y: 50 },
];

const segmentDuration = 1200; // ms per segment

function AnimatedDrill({ path, player2Path, puckPath }) {
  const points = (Array.isArray(path) && path.length > 1) ? path : figureEightPoints;
  const hasPlayer2 = Array.isArray(player2Path) && player2Path.length > 1;
  const hasPuck = Array.isArray(puckPath) && puckPath.length > 1;
  
  // Player 1 state
  const [player1Pos, setPlayer1Pos] = useState(points[0]);
  const [player1Done, setPlayer1Done] = useState(false);
  
  // Player 2 state
  const [player2Pos, setPlayer2Pos] = useState(hasPlayer2 ? player2Path[0] : null);
  const [player2Done, setPlayer2Done] = useState(false);
  
  // Puck state
  const [puckPos, setPuckPos] = useState(hasPuck ? puckPath[0] : points[0]);
  const [puckDone, setPuckDone] = useState(false);
  
  // Animation refs
  const player1SegmentRef = useRef(0);
  const player2SegmentRef = useRef(0);
  const puckSegmentRef = useRef(0);
  const player1StartTimeRef = useRef(null);
  const player2StartTimeRef = useRef(null);
  const puckStartTimeRef = useRef(null);
  
  // Replay trigger
  const [replayKey, setReplayKey] = useState(0);

  // Reset animation state
  useEffect(() => {
    player1SegmentRef.current = 0;
    player2SegmentRef.current = 0;
    puckSegmentRef.current = 0;
    setPlayer1Done(false);
    setPlayer2Done(false);
    setPuckDone(false);
    setPlayer1Pos(points[0]);
    setPlayer2Pos(hasPlayer2 ? player2Path[0] : null);
    setPuckPos(hasPuck ? puckPath[0] : points[0]);
    player1StartTimeRef.current = null;
    player2StartTimeRef.current = null;
    puckStartTimeRef.current = null;
  }, [JSON.stringify(points), JSON.stringify(player2Path), JSON.stringify(puckPath), replayKey]);

  // Animate Player 1
  useEffect(() => {
    let animationFrame;
    function animatePlayer1(time) {
      if (!player1StartTimeRef.current) player1StartTimeRef.current = time;
      const elapsed = time - player1StartTimeRef.current;
      const currentIndex = player1SegmentRef.current;
      const from = points[currentIndex];
      const to = points[currentIndex + 1];
      if (!to) {
        setPlayer1Done(true);
        return;
      }
      const progress = Math.min(elapsed / segmentDuration, 1);
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      setPlayer1Pos({ x, y });
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animatePlayer1);
      } else {
        player1SegmentRef.current += 1;
        player1StartTimeRef.current = null;
        animationFrame = requestAnimationFrame(animatePlayer1);
      }
    }
    animationFrame = requestAnimationFrame(animatePlayer1);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [JSON.stringify(points), replayKey]);

  // Animate Player 2
  useEffect(() => {
    if (hasPlayer2) {
      let animationFrame;
      function animatePlayer2(time) {
        if (!player2StartTimeRef.current) player2StartTimeRef.current = time;
        const elapsed = time - player2StartTimeRef.current;
        const currentIndex = player2SegmentRef.current;
        const from = player2Path[currentIndex];
        const to = player2Path[currentIndex + 1];
        if (!to) {
          setPlayer2Done(true);
          return;
        }
        const progress = Math.min(elapsed / segmentDuration, 1);
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        setPlayer2Pos({ x, y });
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animatePlayer2);
        } else {
          player2SegmentRef.current += 1;
          player2StartTimeRef.current = null;
          animationFrame = requestAnimationFrame(animatePlayer2);
        }
      }
      animationFrame = requestAnimationFrame(animatePlayer2);
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }
  }, [JSON.stringify(player2Path), hasPlayer2, replayKey]);

  // Animate Puck
  useEffect(() => {
    if (hasPuck) {
      let animationFrame;
      function animatePuck(time) {
        if (!puckStartTimeRef.current) puckStartTimeRef.current = time;
        const elapsed = time - puckStartTimeRef.current;
        const currentIndex = puckSegmentRef.current;
        const from = puckPath[currentIndex];
        const to = puckPath[currentIndex + 1];
        if (!to) {
          setPuckDone(true);
          return;
        }
        const progress = Math.min(elapsed / segmentDuration, 1);
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        setPuckPos({ x, y });
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animatePuck);
        } else {
          puckSegmentRef.current += 1;
          puckStartTimeRef.current = null;
          animationFrame = requestAnimationFrame(animatePuck);
        }
      }
      animationFrame = requestAnimationFrame(animatePuck);
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }
  }, [JSON.stringify(puckPath), hasPuck, replayKey]);

  // Determine if animation is complete
  const isComplete = player1Done && (!hasPlayer2 || player2Done) && (!hasPuck || puckDone);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: '100%' }}
      >
        <RinkVisualizer />
        {/* Player 1 path */}
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="black"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        {/* Player 2 path */}
        {hasPlayer2 && (
          <polyline
            points={player2Path.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="blue"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
        )}
        {/* Puck path */}
        {hasPuck && (
          <polyline
            points={puckPath.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="gray"
            strokeWidth="0.2"
            strokeDasharray="1,1"
          />
        )}
        {/* Player 1 (red dot) */}
        <circle cx={player1Pos.x} cy={player1Pos.y} r={PLAYER_RADIUS} fill="red" />
        {/* Player 2 (blue dot) */}
        {hasPlayer2 && player2Pos && (
          <circle cx={player2Pos.x} cy={player2Pos.y} r={PLAYER2_RADIUS} fill="blue" />
        )}
        {/* Puck (black dot) */}
        {hasPuck && (
          <circle cx={puckPos.x} cy={puckPos.y} r={PUCK_RADIUS} fill="black" />
        )}
      </svg>
      {isComplete && (
        <button
          onClick={() => setReplayKey(prev => prev + 1)}
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.7rem 1.5rem',
            background: '#223366',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 2
          }}
        >
          Replay Drill
        </button>
      )}
    </div>
  );
}

export default AnimatedDrill;
