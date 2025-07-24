import {
  WIDTH,
  HEIGHT,
  blueLineStroke,
  centerLineStroke,
  faceOffRadius,
  goalCreaseRadius,
  topBlueY,
  bottomBlueY,
  hashMarkLength,
  hashOffsetY,
  hashStartOffset,
  nonCentreFaceOffs,
  neutralZoneDots,
} from '../constants/rinkConstants';

function RinkOutline() {
  return (
    <rect
      x="0"
      y="0"
      width={WIDTH}
      height={HEIGHT}
      rx={8}
      ry={8}
      fill="#e0f7ff"
      stroke="#003"
      strokeWidth="0.5"
    />
  );
}

function GoalCrease({ y }) {
  return (
    <path
      d={`
        M ${25 - goalCreaseRadius},${y}
        A ${goalCreaseRadius},${goalCreaseRadius} 0 0 ${y < HEIGHT / 2 ? 0 : 1} ${25 + goalCreaseRadius},${y}
      `}
      stroke="blue"
      strokeWidth="0.3"
      fill="rgba(0, 0, 255, 0.2)"
    />
  );
}

function FaceOffCircle({ cx, cy, isCenter }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={faceOffRadius}
      stroke={isCenter ? 'blue' : 'red'}
      strokeWidth="0.3"
      fill="none"
    />
  );
}

function FaceOffDot({ cx, cy, size = 0.5, fill = 'red' }) {
  return <circle cx={cx} cy={cy} r={size} fill={fill} />;
}

function HashMarks({ cx, cy }) {
  return (
    <g>
      {[-1, 1].map((dir) => (
        <g key={dir}>
          <line
            x1={cx - dir * hashStartOffset}
            y1={cy - hashOffsetY}
            x2={cx - dir * (hashStartOffset + hashMarkLength)}
            y2={cy - hashOffsetY}
            stroke="red"
            strokeWidth="0.3"
          />
          <line
            x1={cx - dir * hashStartOffset}
            y1={cy + hashOffsetY}
            x2={cx - dir * (hashStartOffset + hashMarkLength)}
            y2={cy + hashOffsetY}
            stroke="red"
            strokeWidth="0.3"
          />
        </g>
      ))}
    </g>
  );
}

function RinkVisualizer() {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#e0f7ff',
        border: '2px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <RinkOutline />

      {/* Goal Lines */}
      <line x1="0" y1="7" x2={WIDTH} y2="7" stroke="red" strokeWidth={centerLineStroke} />
      <line x1="0" y1="93" x2={WIDTH} y2="93" stroke="red" strokeWidth={centerLineStroke} />

      {/* Blue Lines */}
      <line x1="0" y1={topBlueY} x2={WIDTH} y2={topBlueY} stroke="blue" strokeWidth={blueLineStroke} />
      <line x1="0" y1={bottomBlueY} x2={WIDTH} y2={bottomBlueY} stroke="blue" strokeWidth={blueLineStroke} />

      {/* Centre Red Line */}
      <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="red" strokeWidth={centerLineStroke} />

      {/* Goal Creases */}
      <GoalCrease y={7} />
      <GoalCrease y={93} />

      {/* Face-off Circles */}
      {[...nonCentreFaceOffs, { cx: 25, cy: 50 }].map(({ cx, cy }, i) => (
        <FaceOffCircle key={i} cx={cx} cy={cy} isCenter={cx === 25 && cy === 50} />
      ))}

      {/* Dots */}
      {nonCentreFaceOffs.map(({ cx, cy }, i) => (
        <FaceOffDot key={`dot-${i}`} cx={cx} cy={cy} />
      ))}
      <FaceOffDot cx={25} cy={50} size={0.5} fill="blue" />
      {neutralZoneDots.map(({ cx, cy }, i) => (
        <FaceOffDot key={`neutral-${i}`} cx={cx} cy={cy} />
      ))}

      {/* Hash Marks */}
      {nonCentreFaceOffs.map(({ cx, cy }, i) => (
        <HashMarks key={`hash-${i}`} cx={cx} cy={cy} />
      ))}
    </svg>
  );
}

export default RinkVisualizer;
