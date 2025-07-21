// Dimensions
export const WIDTH = 50;
export const HEIGHT = 100;

// Line strokes
export const blueLineStroke = 0.8;
export const centerLineStroke = 0.8;

// Face-off & crease
export const faceOffRadius = 6;
export const goalCreaseRadius = 4;

// Blue line Y positions
export const topBlueY = HEIGHT * 0.33;
export const bottomBlueY = HEIGHT * 0.67;

// Hash marks
export const hashMarkLength = 1.2;
export const hashOffsetY = 1.3;
export const hashStartOffset = faceOffRadius;

// Dots
export const nonCentreFaceOffs = [
  { cx: 13, cy: 17 },
  { cx: 37, cy: 17 },
  { cx: 13, cy: 83 },
  { cx: 37, cy: 83 },
];

export const neutralZoneDots = [
  { cx: 13, cy: topBlueY + 3 },
  { cx: 37, cy: topBlueY + 3 },
  { cx: 13, cy: bottomBlueY - 3 },
  { cx: 37, cy: bottomBlueY - 3 },
];
