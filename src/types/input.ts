export type Direction = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type AttackButton = 'LP' | 'MP' | 'HP' | 'LK' | 'MK' | 'HK';

export type NormalizedInput = {
  id: string;
  kind: 'direction' | 'button';
  value: Direction | AttackButton;
  timestamp: number;
};

export type DetectedCommand = {
  id: string;
  notation: string;
  motion: string;
  button: AttackButton;
  timestamp: number;
  durationMs: number;
};

export type ControllerDiagnostics = {
  id: string;
  mapping: string;
  index: number;
  axes: number[];
  pressedButtons: number[];
  direction: Direction;
};
