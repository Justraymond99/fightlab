export type Direction = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type AttackButton = 'LP' | 'MP' | 'HP' | 'LK' | 'MK' | 'HK';

export type NormalizedInput = {
  id: string;
  kind: 'direction' | 'button';
  value: Direction | AttackButton;
  timestamp: number;
  frame: number;
};

export type MotionDefinition = {
  id: string;
  name: string;
  notation: string;
  maxDurationMs: number;
  maxDurationFrames: number;
  allowExtraDirections: boolean;
};

export type ExecutionGrade = {
  letter: 'S' | 'A' | 'B' | 'C' | 'D';
  score: number;
  label: string;
  feedback: string;
};

export type DetectedCommand = {
  id: string;
  notation: string;
  motion: string;
  button: AttackButton;
  timestamp: number;
  frame: number;
  durationMs: number;
  durationFrames: number;
  confidence: number;
  extraDirections: number;
  grade: ExecutionGrade;
};

export type ControllerDiagnostics = {
  id: string;
  mapping: string;
  index: number;
  axes: number[];
  pressedButtons: number[];
  direction: Direction;
  frame: number;
  pollingHz: number;
};