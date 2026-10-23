import { useRef } from 'react';
import { useStarField } from './useStarField';
import styles from './Landing.module.scss';

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className={styles['landing__starfield']}
      aria-hidden="true"
      data-testid="starfield-canvas"
    />
  );
}
