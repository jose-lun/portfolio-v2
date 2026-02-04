import { useEffect, useRef } from "react";

export default function LessonStep({
  children,
  mode = "centered", // "centered" | "split"
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
        // entry.boundingClientRect is relative to viewport
        const r = entry.boundingClientRect;
        const vh = window.innerHeight;

        // We define three regions:
        // pre: not reached yet
        // in: overlaps center band
        // out: passed above
        const centerBandTop = vh * 0.25;
        const centerBandBot = vh * 0.75;

        const overlapsCenterBand = r.bottom > centerBandTop && r.top < centerBandBot;
        const passedAbove = r.bottom <= centerBandTop;

        if (overlapsCenterBand) el.dataset.phase = "in";
        else if (passedAbove) el.dataset.phase = "out";
        else el.dataset.phase = "pre";
      },
      { threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls = mode === "split" ? "lesson-step is-split" : "lesson-step is-centered";

  return (
    <section ref={ref} className={cls} data-phase="pre">
      <div className="lesson-step-inner">{children}</div>
    </section>
  );
}
