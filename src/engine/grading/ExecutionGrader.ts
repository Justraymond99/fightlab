import type { ExecutionGrade, MotionDefinition } from '../../types/input';

export function gradeExecution(
  durationMs: number,
  durationFrames: number,
  definition: MotionDefinition,
  extraDirections: number,
): ExecutionGrade {
  const speedRatio = Math.max(
    durationMs / definition.maxDurationMs,
    durationFrames / definition.maxDurationFrames,
  );

  let score = 100;
  score -= Math.max(0, speedRatio - 0.35) * 55;
  score -= extraDirections * 8;
  score = Math.max(0, Math.min(100, Math.round(score)));

  if (score >= 95) return { letter: 'S', score, label: 'Perfect', feedback: 'Clean and fast execution.' };
  if (score >= 88) return { letter: 'A', score, label: 'Excellent', feedback: 'Strong execution with minimal waste.' };
  if (score >= 78) return { letter: 'B', score, label: 'Good', feedback: 'Recognized cleanly. Tighten the motion slightly.' };
  if (score >= 65) return { letter: 'C', score, label: 'Sloppy', feedback: 'Motion worked, but extra inputs or timing reduced precision.' };
  return { letter: 'D', score, label: 'Slow', feedback: 'Motion barely fit the recognition window.' };
}