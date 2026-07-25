import { useEffect, useRef, useState } from 'react';

export type InputEvent = {
  id: string;
  label: string;
  timestamp: number;
};

const BUTTON_LABELS = [
  'LP', 'MP', 'LK', 'MK',
  'L1', 'R1', 'L2', 'R2',
  'Select', 'Start', 'L3', 'R3',
  'Up', 'Down', 'Left', 'Right',
  'Home',
];

function axisToDirection(x: number, y: number): string | null {
  const deadzone = 0.45;
  const horizontal = Math.abs(x) > deadzone ? Math.sign(x) : 0;
  const vertical = Math.abs(y) > deadzone ? Math.sign(y) : 0;

  const key = `${horizontal},${vertical}`;
  const map: Record<string, string> = {
    '-1,-1': '7',
    '0,-1': '8',
    '1,-1': '9',
    '-1,0': '4',
    '0,0': '5',
    '1,0': '6',
    '-1,1': '1',
    '0,1': '2',
    '1,1': '3',
  };

  return key === '0,0' ? null : map[key];
}

export function useGamepad() {
  const [gamepadName, setGamepadName] = useState<string | null>(null);
  const [inputs, setInputs] = useState<InputEvent[]>([]);
  const previousButtons = useRef<boolean[]>([]);
  const previousDirection = useRef<string | null>(null);

  useEffect(() => {
    let animationFrame = 0;

    const poll = () => {
      const gamepad = Array.from(navigator.getGamepads()).find(Boolean);

      if (!gamepad) {
        setGamepadName(null);
        animationFrame = requestAnimationFrame(poll);
        return;
      }

      setGamepadName(gamepad.id);
      const nextEvents: string[] = [];

      gamepad.buttons.forEach((button, index) => {
        const wasPressed = previousButtons.current[index] ?? false;
        if (button.pressed && !wasPressed) {
          nextEvents.push(BUTTON_LABELS[index] ?? `B${index}`);
        }
      });

      previousButtons.current = gamepad.buttons.map((button) => button.pressed);

      const direction = axisToDirection(gamepad.axes[0] ?? 0, gamepad.axes[1] ?? 0);
      if (direction && direction !== previousDirection.current) {
        nextEvents.push(direction);
      }
      previousDirection.current = direction;

      if (nextEvents.length > 0) {
        const now = performance.now();
        setInputs((current) => [
          ...nextEvents.map((label, index) => ({
            id: `${now}-${index}`,
            label,
            timestamp: now,
          })),
          ...current,
        ].slice(0, 20));
      }

      animationFrame = requestAnimationFrame(poll);
    };

    const handleDisconnect = () => {
      previousButtons.current = [];
      previousDirection.current = null;
      setGamepadName(null);
    };

    window.addEventListener('gamepaddisconnected', handleDisconnect);
    animationFrame = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  return {
    gamepadName,
    connected: Boolean(gamepadName),
    inputs,
    clearInputs: () => setInputs([]),
  };
}
