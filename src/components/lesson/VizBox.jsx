export default function VizBox({ title, subtitle, children }) {
  return (
    <div className="lesson-viz-box">
      {(title || subtitle) && (
        <div style={{ padding: "18px 18px 0", opacity: 0.85 }}>
          {title && (
            <>
              <div style={{ 
                fontSize: 12, 
                letterSpacing: "0.08em", 
                textTransform: "uppercase", 
                opacity: 0.7 
              }}>
                Visualization
              </div>
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 750 }}>
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
      <div style={{ padding: 18 }}>
        {children}
      </div>
    </div>
  );
}