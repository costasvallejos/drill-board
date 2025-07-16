const WIDTH = 50;
const HEIGHT = 100;

const blueLineStroke = 0.8;
const centerLineStroke = 0.8;
const faceOffRadius = 6;
const goalCreaseRadius = 4;

const topBlueY = HEIGHT * 0.33;
const bottomBlueY = HEIGHT * 0.67;

const hashMarkLength = 1.2;
const hashOffsetY = 1.3;
const hashStartOffset = faceOffRadius;

const nonCentreFaceOffs = [
  { cx: 13, cy: 15 },
  { cx: 37, cy: 15 },
  { cx: 13, cy: 85 },
  { cx: 37, cy: 85 },
];

const neutralZoneDots = [
  { cx: 13, cy: topBlueY + 3 },
  { cx: 37, cy: topBlueY + 3 },
  { cx: 13, cy: bottomBlueY - 3 },
  { cx: 37, cy: bottomBlueY - 3 },
];

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
      {/* Left side hash marks */}
      <line
        x1={cx - hashStartOffset}
        y1={cy - hashOffsetY}
        x2={cx - hashStartOffset - hashMarkLength}
        y2={cy - hashOffsetY}
        stroke="red"
        strokeWidth="0.3"
      />
      <line
        x1={cx - hashStartOffset}
        y1={cy + hashOffsetY}
        x2={cx - hashStartOffset - hashMarkLength}
        y2={cy + hashOffsetY}
        stroke="red"
        strokeWidth="0.3"
      />
      {/* Right side hash marks */}
      <line
        x1={cx + hashStartOffset}
        y1={cy - hashOffsetY}
        x2={cx + hashStartOffset + hashMarkLength}
        y2={cy - hashOffsetY}
        stroke="red"
        strokeWidth="0.3"
      />
      <line
        x1={cx + hashStartOffset}
        y1={cy + hashOffsetY}
        x2={cx + hashStartOffset + hashMarkLength}
        y2={cy + hashOffsetY}
        stroke="red"
        strokeWidth="0.3"
      />
    </g>
  );
}

function RinkVisualizer() {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#e0f7ff',
        border: '2px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <RinkOutline />

      {/* Red goal lines - shifted to align with flat part of rounded rink */}
      <line x1="0" y1="7" x2={WIDTH} y2="7" stroke="red" strokeWidth={centerLineStroke} />
      <line x1="0" y1="93" x2={WIDTH} y2="93" stroke="red" strokeWidth={centerLineStroke} />

      {/* Blue lines */}
      <line
        x1="0"
        y1={topBlueY}
        x2={WIDTH}
        y2={topBlueY}
        stroke="blue"
        strokeWidth={blueLineStroke}
      />
      <line
        x1="0"
        y1={bottomBlueY}
        x2={WIDTH}
        y2={bottomBlueY}
        stroke="blue"
        strokeWidth={blueLineStroke}
      />

      {/* Red centre line */}
      <line
        x1="0"
        y1={HEIGHT / 2}
        x2={WIDTH}
        y2={HEIGHT / 2}
        stroke="red"
        strokeWidth={centerLineStroke}
      />

      {/* Goalie creases (also adjusted) */}
      <GoalCrease y={7} />
      <GoalCrease y={93} />

      {/* Face-off circles */}
      {[...nonCentreFaceOffs, { cx: 25, cy: 50 }].map(({ cx, cy }, i) => (
        <FaceOffCircle
          key={i}
          cx={cx}
          cy={cy}
          isCenter={cx === 25 && cy === 50}
        />
      ))}

      {/* Face-off dots */}
      {nonCentreFaceOffs.map(({ cx, cy }, i) => (
        <FaceOffDot key={i} cx={cx} cy={cy} />
      ))}
      <FaceOffDot cx={25} cy={50} size={0.5} fill="blue" />

      {/* Neutral zone face-off dots */}
      {neutralZoneDots.map(({ cx, cy }, i) => (
        <FaceOffDot key={`neutral-${i}`} cx={cx} cy={cy} />
      ))}

      {/* Hash marks outside the face-off circles */}
      {nonCentreFaceOffs.map(({ cx, cy }, i) => (
        <HashMarks key={i} cx={cx} cy={cy} />
      ))}
    </svg>
  );
}

export default RinkVisualizer;
