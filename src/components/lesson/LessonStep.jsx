import { useEffect, useRef } from "react";

export default function LessonStep({
  children,
  mode = "centered", // "centered" | "split"
  style,
  rootMargin = "-10% 0px -50% 0px" // Default triggers when element enters middle 60% of viewport
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already visible on load, show it (no animation surprise)
    const rect = el.getBoundingClientRect();
    const inViewOnLoad = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewOnLoad) el.dataset.phase = "in";
    else el.dataset.phase = "pre";

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Simple approach: element is "in" when it's intersecting (visible)
        if (entry.isIntersecting) {
          el.dataset.phase = "in";
        } else {
          // Check if we've scrolled past it
          if (entry.boundingClientRect.top < 0) {
            el.dataset.phase = "out";
          } else {
            el.dataset.phase = "pre";
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: rootMargin
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  const cls = mode === "split"
    ? "lesson-step is-split"
    : mode === "left"
      ? "lesson-step is-left"
      : "lesson-step is-centered";

  // For split/sticky-split mode, wrap each child in lesson-fade separately to maintain grid
  // For centered/left mode, wrap all children together
  const content = (mode === "split")
    ? Array.isArray(children)
      ? children.map((child, i) => (
        <div key={i} className="lesson-fade">{child}</div>
      ))
      : <div className="lesson-fade">{children}</div>
    : <div className="lesson-fade">{children}</div>;

  return (
    <section ref={ref} className={cls} data-phase="pre" style={style}>
      <div className="lesson-step-inner">{content}</div>
    </section>
  );
}