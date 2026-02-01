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
            href="https://github.com/jose-lun"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
        >
            <svg viewBox="0 0 24 24" className="icon-svg">
            <path fill="currentColor" d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.56 0-.28-.01-1.2-.02-2.18-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.14 1.19a10.9 10.9 0 0 1 5.72 0c2.18-1.5 3.14-1.19 3.14-1.19.62 1.59.23 2.77.11 3.06.73.81 1.18 1.85 1.18 3.11 0 4.43-2.69 5.41-5.25 5.69.41.35.77 1.03.77 2.08 0 1.5-.01 2.7-.01 3.07 0 .31.21.67.79.56A11.01 11.01 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"/>
            </svg>
            GitHub
        </a>

        <a
            href="https://linkedin.com/in/jose-luna-986545129/"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
        >
            <svg viewBox="0 0 24 24" className="icon-svg">
            <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5ZM.23 8.09h4.5V24H.23V8.09ZM7.98 8.09h4.31v2.16h.06c.6-1.14 2.06-2.34 4.24-2.34 4.53 0 5.37 2.98 5.37 6.85V24h-4.5v-7.64c0-1.82-.03-4.16-2.53-4.16-2.54 0-2.93 1.98-2.93 4.03V24h-4.5V8.09Z"/>
            </svg>
            LinkedIn
        </a>

        <button onClick={copyEmail} className="icon-btn">
            <svg viewBox="0 0 24 24" className="icon-svg">
            <path fill="currentColor" d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
            </svg>
            Email
        </button>

        <a href="/resume.pdf" download className="icon-btn">
            <svg viewBox="0 0 24 24" className="icon-svg">
            <path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6Zm1 7V3.5L18.5 9H15ZM12 17l-4-4h3V9h2v4h3l-4 4Z"/>
            </svg>
            Resume
        </a>
        </div>

    </div>
  );
}
