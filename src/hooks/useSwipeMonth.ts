import { useRef } from 'react';

export interface UseSwipeMonthOptions {
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  threshold?: number;
  maxDuration?: number;
}

export function useSwipeMonth({
  onPrevMonth,
  onNextMonth,
  onPrev,
  onNext,
  threshold = 35,
  maxDuration = 800,
}: UseSwipeMonthOptions) {
  const triggerPrev = onPrev || onPrevMonth;
  const triggerNext = onNext || onNextMonth;
  const pointerStartRef = useRef<{ x: number; y: number; time: number; isMouseDown: boolean } | null>(null);
  const pointerDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      pointerStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
        isMouseDown: false,
      };
      pointerDeltaRef.current = { x: 0, y: 0 };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!pointerStartRef.current || e.touches.length !== 1) return;
    pointerDeltaRef.current = {
      x: e.touches[0].clientX - pointerStartRef.current.x,
      y: e.touches[0].clientY - pointerStartRef.current.y,
    };
  };

  const onTouchEnd = () => {
    if (!pointerStartRef.current) return;
    const { x: dx, y: dy } = pointerDeltaRef.current;
    const elapsed = Date.now() - pointerStartRef.current.time;
    pointerStartRef.current = null;
    pointerDeltaRef.current = { x: 0, y: 0 };

    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 0.9 && elapsed <= maxDuration) {
      if (dx < 0) {
        triggerNext?.();
      } else {
        triggerPrev?.();
      }
    }
  };

  // Mouse / Pointer Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      isMouseDown: true,
    };
    pointerDeltaRef.current = { x: 0, y: 0 };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!pointerStartRef.current || !pointerStartRef.current.isMouseDown) return;
    pointerDeltaRef.current = {
      x: e.clientX - pointerStartRef.current.x,
      y: e.clientY - pointerStartRef.current.y,
    };
  };

  const onMouseUp = () => {
    if (!pointerStartRef.current || !pointerStartRef.current.isMouseDown) return;
    const { x: dx, y: dy } = pointerDeltaRef.current;
    const elapsed = Date.now() - pointerStartRef.current.time;
    pointerStartRef.current = null;
    pointerDeltaRef.current = { x: 0, y: 0 };

    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 0.9 && elapsed <= maxDuration) {
      if (dx < 0) {
        triggerNext?.();
      } else {
        triggerPrev?.();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}

