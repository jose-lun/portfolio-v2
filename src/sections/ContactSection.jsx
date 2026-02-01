export default function ContactSection() {
  function copyEmail() {
    navigator.clipboard.writeText("joselunaboja@gmail.com");
    alert("Email copied to clipboard!");
  }

  return (
    <div className="section" style={{ textAlign: "center" }}>
      <h2 style={{ margin: 0, fontSize: "clamp(28px, 3.5vw, 38px)" }}>
        Let’s Connect
      </h2>
      <p style={{ marginTop: 12, opacity: 0.8 }}>
        Find me online or grab my resume below.
      </p>

      <div className="contact-icons">
        <a
          href="https://github.com/YOUR_USERNAME"
          target="_blank"
          rel="noreferrer"
          className="icon-btn"
        >
          🐙 GitHub
        </a>

        <a
          href="https://linkedin.com/in/YOUR_LINKEDIN"
          target="_blank"
          rel="noreferrer"
          className="icon-btn"
        >
          💼 LinkedIn
        </a>

        <button onClick={copyEmail} className="icon-btn">
          ✉️ Email
        </button>

        <a href="/resume.pdf" download className="icon-btn">
          📄 Resume
        </a>
      </div>
    </div>
  );
}
