import { useEffect, useRef, useState } from "react";

export default function LessonStep({
  children,
  onEnter,
  center = false,
  wide = false,
  className = "",
}) {
  const ref = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const activeRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1) visibility observer: fade in once
    const visObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    // 2) active observer: center band
    const activeObs = new IntersectionObserver(
      ([entry]) => {
        const now = entry.isIntersecting;

        // Only fire onEnter when transitioning false -> true
        if (now && !activeRef.current) {
          activeRef.current = true;
          setIsActive(true);
          onEnter?.();
        }

        // Mark inactive when leaving band (for debug + future re-enter)
        if (!now && activeRef.current) {
          activeRef.current = false;
          setIsActive(false);
        }
      },
      {
        threshold: 0,
        rootMargin: "-49% 0px -49% 0px",
      }
    );

    visObs.observe(el);
    activeObs.observe(el);

    return () => {
      visObs.disconnect();
      activeObs.disconnect();
    };
  }, [onEnter]);

  return (
    <div
      ref={ref}
      className={[
        "lesson-step",
        isVisible ? "is-visible" : "",
        isActive ? "is-active" : "",
        center ? "is-centered" : "",
        wide ? "is-wide" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
