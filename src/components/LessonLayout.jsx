export default function LessonLayout({
  title,
  subtitle,
  visual,
  collapseViz = false,
  children,
}) {
  return (
    <div className="lesson-page">
      <div className="lesson-hero">
        <h1 className="lesson-title">{title}</h1>
        {subtitle ? <p className="lesson-subtitle">{subtitle}</p> : null}
      </div>

      <div className={`lesson-flow has-viz ${collapseViz ? "viz-collapsed" : ""}`}>
        {children}
        <div className="lesson-right">{visual}</div>
      </div>
    </div>
  );
}
