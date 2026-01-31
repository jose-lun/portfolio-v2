export default function HomeSection() {
    const nameColor = "rgba(150, 180, 255, 1)";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "0 24px",
        position: "relative",
        zIndex: 1, // ensures it's above the background canvas
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Hi, I&apos;m{" "}
          <span style={{ color: nameColor }}>Jose</span>.
        </h1>

        <p
          style={{
            marginTop: 18,
            fontSize: "clamp(18px, 2.2vw, 22px)",
            lineHeight: 1.5,
            opacity: 0.85,
          }}
        >
          A <span style={{ fontWeight: 650 }}>software developer</span> with a passion for {" "}
          <span style={{ fontWeight: 650 }}>applied math</span>.
        </p>
        <button
        onClick={() => {
            const el = document.getElementById("projects");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        style={{
            marginTop: 10,
            padding: "14px 26px",
            fontSize: "16px",
            borderRadius: 999,
            border: "1px solid rgba(150, 180, 255, 0.4)",
            background: "rgba(150, 180, 255, 0.08)",
            color: "var(--text)",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(150, 180, 255, 0.18)";
            e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(150, 180, 255, 0.08)";
            e.currentTarget.style.transform = "translateY(0px)";
        }}
        >
        View my work ↓
        </button>
      </div>
    </div>
  );
}
