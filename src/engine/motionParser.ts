import { gradeExecution } from './grading/ExecutionGrader';
import { MOTION_DEFINITIONS } from './parser/motionDefinitions';
import type {
  AttackButton,
  DetectedCommand,
  Direction,
  MotionDefinition,
  NormalizedInput,
} from '../types/input';

const ATTACK_BUTTONS = new Set<AttackButton>(['LP', 'MP', 'HP', 'LK', 'MK', 'HK']);

function collapseDirections(inputs: NormalizedInput[]): NormalizedInput[] {
  const directions: NormalizedInput[] = [];

  for (const input of inputs) {
    if (input.kind !== 'direction' || input.value === 5) continue;
    if (directions[directions.length - 1]?.value !== input.value) directions.push(input);
  }

  return directions;
}

function matchMotion(
  directions: NormalizedInput[],
  definition: MotionDefinition,
): { matched: NormalizedInput[]; extraDirections: number } | null {
  const expected = definition.notation.split('').map(Number) as Direction[];
  const matched: NormalizedInput[] = [];
  let cursor = 0;

  for (let index = 0; index < directions.length; index += 1) {
    const input = directions[index];

    if (input.value === expected[cursor]) {
      matched.push(input);
      cursor += 1;
      if (cursor === expected.length) {
        return {
          matched,
          extraDirections: Math.max(0, index + 1 - expected.length),
        };
      }
    } else if (!definition.allowExtraDirections && cursor > 0) {
      return null;
    }
  }

  return null;
}

export function detectCommand(
  inputs: NormalizedInput[],
  buttonInput: NormalizedInput,
): DetectedCommand | null {
  if (buttonInput.kind !== 'button' || !ATTACK_BUTTONS.has(buttonInput.value as AttackButton)) {
    return null;
  }

  const button = buttonInput.value as AttackButton;

  for (const definition of MOTION_DEFINITIONS) {
    const recentInputs = inputs.filter(
      (input) =>
        input.timestamp <= buttonInput.timestamp &&
        buttonInput.timestamp - input.timestamp <= definition.maxDurationMs,
    );
    const match = matchMotion(collapseDirections(recentInputs), definition);
    if (!match) continue;

    const first = match.matched[0];
    const durationMs = Math.max(0, buttonInput.timestamp - first.timestamp);
    const durationFrames = Math.max(0, buttonInput.frame - first.frame);
    if (durationFrames > definition.maxDurationFrames) continue;

    const grade = gradeExecution(
      durationMs,
      durationFrames,
      definition,
      match.extraDirections,
    );

    return {
      id: `${buttonInput.id}-${definition.id}`,
      notation: `${definition.notation}${button}`,
      motion: definition.name,
      button,
      timestamp: buttonInput.timestamp,
      frame: buttonInput.frame,
      durationMs,
      durationFrames,
      confidence: Math.max(0.5, Math.min(1, grade.score / 100)),
      extraDirections: match.extraDirections,
      grade,
    };
  }

  return null;
}