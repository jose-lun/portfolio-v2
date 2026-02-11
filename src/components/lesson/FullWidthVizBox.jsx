import { useEffect, useRef } from "react";

export default function FullWidthVizBox({ title, subtitle, showLabel = true, children }) {
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
                if (entry.isIntersecting) {
                    el.dataset.phase = "in";
                } else {
                    if (entry.boundingClientRect.top < 0) {
                        el.dataset.phase = "out";
                    } else {
                        el.dataset.phase = "pre";
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: "-10% 0px -50% 0px"
            }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="lesson-step" ref={ref} style={{ maxWidth: '1000px', padding: '40px 0', margin: '0 auto' }}>
            <div className="lesson-fade">
                <div className="full-width-viz-box">
                    {(title || subtitle) && (
                        <div style={{ padding: "18px 18px 0", opacity: 0.85 }}>
                            {title && (
                                <>
                                    {showLabel && (
                                        <div style={{
                                            fontSize: 12,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            opacity: 0.7
                                        }}>
                                            Visualization
                                        </div>
                                    )}
                                    <div style={{ marginTop: showLabel ? 10 : 0, fontSize: 18, fontWeight: 750 }}>
                                        {title}
                                    </div>
                                </>
                            )}
                            {subtitle && (
                                <div style={{ marginTop: 8, opacity: 0.75, lineHeight: 1.5, fontSize: 14 }}>
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    )}
                    <div style={{
                        padding: 18,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}