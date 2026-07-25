import { useEffect, useRef, useState } from 'react';
import { detectCommand } from '../engine/motionParser';
import type {
  AttackButton,
  ControllerDiagnostics,
  DetectedCommand,
  Direction,
  NormalizedInput,
} from '../types/input';

const ATTACK_BUTTON_MAP: Partial<Record<number, AttackButton>> = {
  0: 'LK',
  1: 'MK',
  2: 'LP',
  3: 'MP',
  5: 'HP',
  7: 'HK',
};

const MAX_INPUTS = 120;
const MAX_COMMANDS = 20;
const DEADZONE = 0.45;

function directionFromGamepad(gamepad: Gamepad): Direction {
  const dpadLeft = gamepad.buttons[14]?.pressed ?? false;
  const dpadRight = gamepad.buttons[15]?.pressed ?? false;
  const dpadUp = gamepad.buttons[12]?.pressed ?? false;
  const dpadDown = gamepad.buttons[13]?.pressed ?? false;

  const axisX = gamepad.axes[0] ?? 0;
  const axisY = gamepad.axes[1] ?? 0;
  const left = dpadLeft || axisX < -DEADZONE;
  const right = dpadRight || axisX > DEADZONE;
  const up = dpadUp || axisY < -DEADZONE;
  const down = dpadDown || axisY > DEADZONE;

  const horizontal = left === right ? 0 : left ? -1 : 1;
  const vertical = up === down ? 0 : up ? -1 : 1;
  const map: Record<string, Direction> = {
    '-1,-1': 7,
    '0,-1': 8,
    '1,-1': 9,
    '-1,0': 4,
    '0,0': 5,
    '1,0': 6,
    '-1,1': 1,
    '0,1': 2,
    '1,1': 3,
  };

  return map[`${horizontal},${vertical}`];
}

export function useGamepad() {
  const [gamepadName, setGamepadName] = useState<string | null>(null);
  const [inputs, setInputs] = useState<NormalizedInput[]>([]);
  const [commands, setCommands] = useState<DetectedCommand[]>([]);
  const [diagnostics, setDiagnostics] = useState<ControllerDiagnostics | null>(null);
  const inputBuffer = useRef<NormalizedInput[]>([]);
  const previousButtons = useRef<boolean[]>([]);
  const previousDirection = useRef<Direction>(5);

  useEffect(() => {
    let animationFrame = 0;

    const appendInput = (input: NormalizedInput) => {
      inputBuffer.current = [...inputBuffer.current, input].slice(-MAX_INPUTS);
      setInputs([...inputBuffer.current].reverse());

      if (input.kind === 'button') {
        const command = detectCommand(inputBuffer.current, input);
        if (command) {
          setCommands((current) => [command, ...current].slice(0, MAX_COMMANDS));
        }
      }
    };

    const poll = () => {
      const gamepad = Array.from(navigator.getGamepads()).find(
        (candidate): candidate is Gamepad => Boolean(candidate?.connected),
      );

      if (!gamepad) {
        setGamepadName(null);
        setDiagnostics(null);
        animationFrame = requestAnimationFrame(poll);
        return;
      }

      setGamepadName(gamepad.id);
      const now = performance.now();
      const direction = directionFromGamepad(gamepad);

      if (direction !== previousDirection.current) {
        appendInput({
          id: `direction-${now}`,
          kind: 'direction',
          value: direction,
          timestamp: now,
        });
        previousDirection.current = direction;
      }

      gamepad.buttons.forEach((button, index) => {
        const wasPressed = previousButtons.current[index] ?? false;
        const attackButton = ATTACK_BUTTON_MAP[index];

        if (button.pressed && !wasPressed && attackButton) {
          appendInput({
            id: `button-${index}-${now}`,
            kind: 'button',
            value: attackButton,
            timestamp: now,
          });
        }
      });

      previousButtons.current = gamepad.buttons.map((button) => button.pressed);
      setDiagnostics({
        id: gamepad.id,
        mapping: gamepad.mapping || 'unmapped',
        index: gamepad.index,
        axes: Array.from(gamepad.axes),
        pressedButtons: gamepad.buttons
          .map((button, index) => (button.pressed ? index : -1))
          .filter((index) => index >= 0),
        direction,
      });

      animationFrame = requestAnimationFrame(poll);
    };

    const resetController = () => {
      previousButtons.current = [];
      previousDirection.current = 5;
      setGamepadName(null);
      setDiagnostics(null);
    };

    window.addEventListener('gamepaddisconnected', resetController);
    animationFrame = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('gamepaddisconnected', resetController);
    };
  }, []);

  const clearInputs = () => {
    inputBuffer.current = [];
    setInputs([]);
    setCommands([]);
  };

  return {
    gamepadName,
    connected: Boolean(gamepadName),
    inputs,
    commands,
    diagnostics,
    clearInputs,
  };
}
