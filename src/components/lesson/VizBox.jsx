export default function VizBox({ title, subtitle, showLabel = true, children }) {
  return (
    <div className="lesson-viz-box">
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
  );
}