/**
 * Native PWA Viewport Lock:
 * Prevents browser pull-to-refresh reload gestures and elastic window dragging on mobile.
 * Makes the PWA feel strictly fixed and native like an iOS/Android native app,
 * while keeping internal page scrolling, modals, and swipe gestures completely functional.
 */

export function initNativePwaLock(): () => void {
  if (typeof window === 'undefined') return () => {};

  let startY = 0;
  let startX = 0;
  let isTracking = false;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isTracking = true;
    } else {
      isTracking = false;
    }
  };

  const isElementScrollable = (el: HTMLElement, direction: 'up' | 'down'): boolean => {
    let current: HTMLElement | null = el;
    while (current && current !== document.body && current !== document.documentElement) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const canScroll =
        (overflowY === 'auto' || overflowY === 'scroll') &&
        current.scrollHeight > current.clientHeight;

      if (canScroll) {
        if (direction === 'down' && current.scrollTop > 0) {
          return true;
        }
        if (
          direction === 'up' &&
          Math.ceil(current.scrollTop + current.clientHeight) < current.scrollHeight
        ) {
          return true;
        }
      }
      current = current.parentElement;
    }
    return false;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isTracking || e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startY;
    const deltaX = currentX - startX;

    // If gesture is predominantly horizontal, ignore to allow tab/month swipe gestures
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      return;
    }

    const target = e.target as HTMLElement | null;

    // 1. User is dragging DOWN (deltaY > 0)
    if (deltaY > 0) {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const isAtPageTop = scrollY <= 0;

      // If at top of the page, check if user is scrolling inside a scrolled child element
      if (isAtPageTop) {
        const canScrollChildDown = target ? isElementScrollable(target, 'down') : false;
        if (!canScrollChildDown) {
          // Block the browser pull-to-refresh reload and rubber-band bounce
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    }
    // 2. User is dragging UP (deltaY < 0)
    else if (deltaY < 0) {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const isAtPageBottom = scrollY >= maxScrollY - 1;

      if (isAtPageBottom) {
        const canScrollChildUp = target ? isElementScrollable(target, 'up') : false;
        if (!canScrollChildUp) {
          // Block bottom elastic bounce pulling out of view
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    }
  };

  const onTouchEnd = () => {
    isTracking = false;
  };

  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  return () => {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
  };
}
