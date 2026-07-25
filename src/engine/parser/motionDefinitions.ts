import type { MotionDefinition } from '../../types/input';

export const MOTION_DEFINITIONS: readonly MotionDefinition[] = [
  {
    id: 'hcf',
    name: 'Half Circle Forward',
    notation: '41236',
    maxDurationMs: 900,
    maxDurationFrames: 54,
    allowExtraDirections: true,
  },
  {
    id: 'hcb',
    name: 'Half Circle Back',
    notation: '63214',
    maxDurationMs: 900,
    maxDurationFrames: 54,
    allowExtraDirections: true,
  },
  {
    id: 'dp',
    name: 'Dragon Punch',
    notation: '623',
    maxDurationMs: 650,
    maxDurationFrames: 39,
    allowExtraDirections: true,
  },
  {
    id: 'rdp',
    name: 'Reverse Dragon Punch',
    notation: '421',
    maxDurationMs: 650,
    maxDurationFrames: 39,
    allowExtraDirections: true,
  },
  {
    id: 'qcf',
    name: 'Quarter Circle Forward',
    notation: '236',
    maxDurationMs: 650,
    maxDurationFrames: 39,
    allowExtraDirections: true,
  },
  {
    id: 'qcb',
    name: 'Quarter Circle Back',
    notation: '214',
    maxDurationMs: 650,
    maxDurationFrames: 39,
    allowExtraDirections: true,
  },
] as const;