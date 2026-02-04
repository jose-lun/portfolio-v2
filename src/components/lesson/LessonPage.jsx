export default function LessonPage({ title, subtitle, children }) {
  return (
    <div className="lesson-page">
      <header className="lesson-hero">
        <h1 className="lesson-title">{title}</h1>
        {subtitle ? <p className="lesson-subtitle">{subtitle}</p> : null}
      </header>
      {children}
    </div>
  );
}
