import { useEffect } from "react";

/**
 * Locks page scroll while a full-screen flow or modal is mounted, so touch/wheel
 * scrolling inside the overlay doesn't chain through to the page behind it.
 */
export function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;

    const { body, documentElement } = document;
    const scrollBarGap = window.innerWidth - documentElement.clientWidth;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollBarGap > 0) {
      body.style.paddingRight = `${scrollBarGap}px`;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [active]);
}
