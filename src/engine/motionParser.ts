import type { AttackButton, DetectedCommand, Direction, NormalizedInput } from '../types/input';

const MOTIONS = [
  { sequence: '63214', name: 'Half Circle Back' },
  { sequence: '41236', name: 'Half Circle Forward' },
  { sequence: '623', name: 'Dragon Punch' },
  { sequence: '421', name: 'Reverse Dragon Punch' },
  { sequence: '236', name: 'Quarter Circle Forward' },
  { sequence: '214', name: 'Quarter Circle Back' },
] as const;

const ATTACK_BUTTONS = new Set<AttackButton>(['LP', 'MP', 'HP', 'LK', 'MK', 'HK']);
const MOTION_WINDOW_MS = 700;

function collapseDirections(inputs: NormalizedInput[]): Direction[] {
  const directions: Direction[] = [];

  for (const input of inputs) {
    if (input.kind !== 'direction' || input.value === 5) continue;
    const direction = input.value as Direction;
    if (directions.at(-1) !== direction) directions.push(direction);
  }

  return directions;
}

function containsSequence(directions: Direction[], sequence: string): boolean {
  let cursor = 0;

  for (const direction of directions) {
    if (String(direction) === sequence[cursor]) cursor += 1;
    if (cursor === sequence.length) return true;
  }

  return false;
}

export function detectCommand(
  inputs: NormalizedInput[],
  buttonInput: NormalizedInput,
): DetectedCommand | null {
  if (buttonInput.kind !== 'button' || !ATTACK_BUTTONS.has(buttonInput.value as AttackButton)) {
    return null;
  }

  const button = buttonInput.value as AttackButton;
  const recentInputs = inputs.filter(
    (input) => input.timestamp <= buttonInput.timestamp && buttonInput.timestamp - input.timestamp <= MOTION_WINDOW_MS,
  );
  const directions = collapseDirections(recentInputs);

  for (const motion of MOTIONS) {
    if (!containsSequence(directions, motion.sequence)) continue;

    const firstDirection = recentInputs.find(
      (input) => input.kind === 'direction' && String(input.value) === motion.sequence[0],
    );

    return {
      id: `${buttonInput.id}-${motion.sequence}`,
      notation: `${motion.sequence}${button}`,
      motion: motion.name,
      button,
      timestamp: buttonInput.timestamp,
      durationMs: Math.max(0, buttonInput.timestamp - (firstDirection?.timestamp ?? buttonInput.timestamp)),
    };
  }

  const latestDirection = [...recentInputs]
    .reverse()
    .find((input) => input.kind === 'direction')?.value as Direction | undefined;

  return {
    id: `${buttonInput.id}-normal`,
    notation: `${latestDirection && latestDirection !== 5 ? latestDirection : ''}${button}`,
    motion: latestDirection && latestDirection !== 5 ? 'Directional normal' : 'Standing normal',
    button,
    timestamp: buttonInput.timestamp,
    durationMs: 0,
  };
}
