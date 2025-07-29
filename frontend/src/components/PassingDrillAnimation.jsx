import React, { useEffect, useRef, useState } from 'react';
import RinkVisualizer from './RinkVisualizer';

const WIDTH = 50;
const HEIGHT = 100;
const PLAYER_RADIUS = 1.5;
const PUCK_RADIUS = 1;
const PLAYER_SPEED = 0.8; // units per frame
const PUCK_SPEED = 1.2; // units per frame
const PASS_THRESHOLD = 2; // distance to consider puck "with" a player

function PassingDrillAnimation({ player1Path, player2Path, puckPath }) {
  const [player1Pos, setPlayer1Pos] = useState(player1Path[0]);
  const [player2Pos, setPlayer2Pos] = useState(player2Path[0]);
  const [puckPos, setPuckPos] = useState(player1Path[0]);
  const [animationDone, setAnimationDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Helper function to calculate distance between two points
  const distance = (pos1, pos2) => Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);

  // Helper function to move towards a target at a given speed
  const moveTowards = (current, target, speed) => {
    const dist = distance(current, target);
    if (dist <= speed) return target;
    
    const ratio = speed / dist;
    return {
      x: current.x + (target.x - current.x) * ratio,
      y: current.y + (target.y - current.y) * ratio
    };
  };

  // Helper function to interpolate between two points
  const interpolate = (from, to, progress) => ({
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress
  });

  // Velocity-based animation
  useEffect(() => {
    setAnimationDone(false);
    setPlayer1Pos(player1Path[0]);
    setPlayer2Pos(player2Path[0]);
    setPuckPos(player1Path[0]);

    let frame;
    let player1Index = 0;
    let player2Index = 0;
    let puckPassIndex = 0; // Index in puckPath for pass events
    let puckWithPlayer = 1; // 1 = player1, 2 = player2
    let isPassing = false;
    let passStartPos = null;
    let passTargetPos = null;
    let passProgress = 0;
    let lastPassTime = 0;
    let frameCount = 0;
    
    // Use local position variables for calculations
    let currentPlayer1Pos = { ...player1Path[0] };
    let currentPlayer2Pos = { ...player2Path[0] };
    let currentPuckPos = { ...player1Path[0] };

    function animate() {
      frameCount++;
      
      // Check if animation is complete
      if (player1Index >= player1Path.length - 1 && 
          player2Index >= player2Path.length - 1 && 
          puckPassIndex >= puckPath.length - 1) {
        setAnimationDone(true);
        return;
      }

      // Move player 1
      if (player1Index < player1Path.length - 1) {
        const target = player1Path[player1Index + 1];
        const newPos = moveTowards(currentPlayer1Pos, target, PLAYER_SPEED);
        currentPlayer1Pos = newPos;
        setPlayer1Pos(newPos);
        
        if (distance(newPos, target) < PLAYER_SPEED) {
          player1Index++;
        }
      }

      // Move player 2
      if (player2Index < player2Path.length - 1) {
        const target = player2Path[player2Index + 1];
        const newPos = moveTowards(currentPlayer2Pos, target, PLAYER_SPEED);
        currentPlayer2Pos = newPos;
        setPlayer2Pos(newPos);
        
        if (distance(newPos, target) < PLAYER_SPEED) {
          player2Index++;
        }
      }

      // Handle puck movement
      if (!isPassing) {
        // Puck is with a player - check if we need to start a pass
        if (puckPassIndex < puckPath.length - 1) {
          const currentPassPoint = puckPath[puckPassIndex];
          const nextPassPoint = puckPath[puckPassIndex + 1];
          
          // Check if we're at a pass point (significant movement in puck path)
          const passDistance = distance(currentPassPoint, nextPassPoint);
          const isPassEvent = passDistance > 2; // Even lower threshold for more sensitive detection
          
          // Also check if enough time has passed since last pass (minimum 20 frames)
          const timeSinceLastPass = frameCount - lastPassTime;
          const shouldPass = isPassEvent && timeSinceLastPass > 20;
          
          if (shouldPass) {
            // Start a pass - determine which player should receive the puck
            const distToPlayer1 = distance(nextPassPoint, currentPlayer1Pos);
            const distToPlayer2 = distance(nextPassPoint, currentPlayer2Pos);
            
            // Determine target player based on which is closer to the next puck position
            const targetPlayer = distToPlayer1 < distToPlayer2 ? 1 : 2;
            const targetPos = targetPlayer === 1 ? currentPlayer1Pos : currentPlayer2Pos;
            
            // Only pass if the target is different from current puck holder
            if (targetPlayer !== puckWithPlayer) {
              isPassing = true;
              passStartPos = puckWithPlayer === 1 ? currentPlayer1Pos : currentPlayer2Pos;
              passTargetPos = targetPos;
              passProgress = 0;
              lastPassTime = frameCount;
            } else {
              // Puck stays with current player but moves to new position
              if (puckWithPlayer === 1) {
                currentPuckPos = { ...currentPlayer1Pos };
              } else {
                currentPuckPos = { ...currentPlayer2Pos };
              }
              setPuckPos(currentPuckPos);
              puckPassIndex++;
            }
          } else {
            // Puck stays with current player
            if (puckWithPlayer === 1) {
              currentPuckPos = { ...currentPlayer1Pos };
            } else {
              currentPuckPos = { ...currentPlayer2Pos };
            }
            setPuckPos(currentPuckPos);
          }
        } else {
          // Puck stays with current player
          if (puckWithPlayer === 1) {
            currentPuckPos = { ...currentPlayer1Pos };
          } else {
            currentPuckPos = { ...currentPlayer2Pos };
          }
          setPuckPos(currentPuckPos);
        }
      } else {
        // Puck is being passed
        const passDistance = distance(passStartPos, passTargetPos);
        passProgress += PUCK_SPEED / passDistance;
        
        if (passProgress >= 1) {
          // Pass complete
          isPassing = false;
          puckWithPlayer = puckWithPlayer === 1 ? 2 : 1;
          currentPuckPos = { ...passTargetPos };
          puckPassIndex++;
        } else {
          // Continue pass animation
          currentPuckPos = interpolate(passStartPos, passTargetPos, passProgress);
        }
        setPuckPos(currentPuckPos);
      }

      // Safety check: ensure puck is always visible
      if (!currentPuckPos || isNaN(currentPuckPos.x) || isNaN(currentPuckPos.y)) {
        // Fallback to current player position
        currentPuckPos = puckWithPlayer === 1 ? { ...currentPlayer1Pos } : { ...currentPlayer2Pos };
        setPuckPos(currentPuckPos);
      }

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => frame && cancelAnimationFrame(frame);
  }, [JSON.stringify(player1Path), JSON.stringify(player2Path), JSON.stringify(puckPath), replayKey]);

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
        
        {/* Player 1 path */}
        <polyline
          points={player1Path.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="red"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        
        {/* Player 2 path */}
        <polyline
          points={player2Path.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="blue"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        
        {/* Puck path */}
        <polyline
          points={puckPath.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="black"
          strokeWidth="0.2"
          strokeDasharray="1,1"
        />
        
        {/* Player 1 (red dot) */}
        <circle cx={player1Pos.x} cy={player1Pos.y} r={PLAYER_RADIUS} fill="red" />
        
        {/* Player 2 (blue dot) */}
        <circle cx={player2Pos.x} cy={player2Pos.y} r={PLAYER_RADIUS} fill="blue" />
        
        {/* Puck (black dot) */}
        <circle cx={puckPos.x} cy={puckPos.y} r={PUCK_RADIUS} fill="black" />
      </svg>
      
      {animationDone && (
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

export default PassingDrillAnimation; 