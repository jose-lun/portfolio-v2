import { useEffect, useRef, useState } from "react";

export default function StickyScrollSection({ stickyContent, children }) {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState("pre");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if already visible on load
    const rect = el.getBoundingClientRect();
    const inViewOnLoad = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewOnLoad) {
      setPhase("in");
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("in");
        } else {
          // Check if scrolled past (above viewport)
          if (entry.boundingClientRect.top < 0) {
            setPhase("out");
          } else {
            setPhase("pre");
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "-10% 0px -45% 0px"
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Calculate styles based on phase
  const getPhaseStyles = () => {
    switch(phase) {
      case "in":
        return {
          opacity: 1,
          transform: 'translateY(0)'
        };
      case "out":
        return {
          opacity: 0,
          transform: 'translateY(-18px)' // Fade up when scrolling past
        };
      case "pre":
      default:
        return {
          opacity: 0,
          transform: 'translateY(18px)' // Fade from below initially
        };
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(320px, 520px)',
        gap: 'clamp(18px, 4vw, 48px)',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 0',
        alignItems: 'start'
      }}
    >
      {/* Left: scrolling content */}
      <div>
        {children}
      </div>
      
      {/* Right: sticky visualization */}
      <div style={{
        position: 'sticky',
        top: '20vh',
        alignSelf: 'start'
      }}>
        <div style={{
          ...getPhaseStyles(),
          transition: 'opacity 450ms ease, transform 450ms ease',
          pointerEvents: phase === "in" ? "auto" : "none"
        }}>
          {stickyContent}
        </div>
      </div>
    </div>
  );
}