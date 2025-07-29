import React, { useEffect, useRef, useState } from 'react';
import RinkVisualizer from './RinkVisualizer';

const WIDTH = 50;
const HEIGHT = 100;
const PLAYER_RADIUS = 1.5;
const PUCK_RADIUS = 1;
const SEGMENT_DURATION = 900; // ms per segment
const SHOT_DURATION = 700; // ms for puck to net

// playerPath: [{x, y}, ...], shotIndex: int, netLocation: {x, y}
function ShootingDrillAnimation({ playerPath, shotIndex, netLocation }) {
  // Player animation state
  const [playerPos, setPlayerPos] = useState(playerPath[0]);
  const [playerDone, setPlayerDone] = useState(false);
  // Puck animation state
  const [puckPos, setPuckPos] = useState(playerPath[0]);
  const [puckShot, setPuckShot] = useState(false);
  const [puckDone, setPuckDone] = useState(false);
  // Replay trigger
  const [replayKey, setReplayKey] = useState(0);

  // Animate player
  useEffect(() => {
    setPlayerDone(false);
    setPlayerPos(playerPath[0]);
    let frame;
    let segIdx = 0;
    let startTime = null;
    function animatePlayer(ts) {
      if (!startTime) startTime = ts;
      const from = playerPath[segIdx];
      const to = playerPath[segIdx + 1];
      if (!to) {
        setPlayerDone(true);
        return;
      }
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / SEGMENT_DURATION, 1);
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      setPlayerPos({ x, y });
      if (progress < 1) {
        frame = requestAnimationFrame(animatePlayer);
      } else {
        segIdx++;
        startTime = null;
        frame = requestAnimationFrame(animatePlayer);
      }
    }
    frame = requestAnimationFrame(animatePlayer);
    return () => frame && cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [JSON.stringify(playerPath), replayKey]);

  // Animate puck
  useEffect(() => {
    setPuckDone(false);
    setPuckShot(false);
    setPuckPos(playerPath[0]);
    let frame;
    let segIdx = 0;
    let startTime = null;
    let shotStarted = false;
    function animatePuck(ts) {
      if (!shotStarted && segIdx < shotIndex) {
        // Follow player up to shot
        if (!startTime) startTime = ts;
        const from = playerPath[segIdx];
        const to = playerPath[segIdx + 1];
        if (!to) {
          setPuckDone(true);
          return;
        }
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / SEGMENT_DURATION, 1);
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        setPuckPos({ x, y });
        if (progress < 1) {
          frame = requestAnimationFrame(animatePuck);
        } else {
          segIdx++;
          startTime = null;
          frame = requestAnimationFrame(animatePuck);
        }
      } else if (!shotStarted && segIdx === shotIndex) {
        // At shot point, start shot
        shotStarted = true;
        setPuckShot(true);
        startTime = null;
        frame = requestAnimationFrame(animatePuck);
      } else if (shotStarted) {
        // Animate puck to net
        if (!startTime) startTime = ts;
        const from = playerPath[shotIndex];
        const to = netLocation;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / SHOT_DURATION, 1);
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        setPuckPos({ x, y });
        if (progress < 1) {
          frame = requestAnimationFrame(animatePuck);
        } else {
          setPuckDone(true);
        }
      }
    }
    frame = requestAnimationFrame(animatePuck);
    return () => frame && cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [JSON.stringify(playerPath), shotIndex, JSON.stringify(netLocation), replayKey]);

  const handleReplay = () => {
    setReplayKey(k => k + 1);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: '100%' }}
      >
        <RinkVisualizer />
        {/* Player path */}
        <polyline
          points={playerPath.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="black"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        {/* Player (red dot) */}
        <circle cx={playerPos.x} cy={playerPos.y} r={PLAYER_RADIUS} fill="red" />
        {/* Puck (black dot) */}
        <circle cx={puckPos.x} cy={puckPos.y} r={PUCK_RADIUS} fill="black" />
        {/* Net indicator (simple rectangle at netLocation) */}
        <rect x={netLocation.x - 3} y={netLocation.y - 1} width={6} height={2} fill="#1f4068" stroke="#003" strokeWidth="0.2" rx={0.5} />
      </svg>
      {(playerDone && puckDone) && (
        <button
          onClick={handleReplay}
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

export default ShootingDrillAnimation; 