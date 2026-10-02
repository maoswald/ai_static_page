const links = {
  github: "https://github.com/manueloswald",
  linkedin: "https://www.linkedin.com/in/manueloswald/",
  email: "mailto:contact@manueloswald.com",
} as const;

type IconProps = {
  className?: string;
};

function TransformationIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="m32 5 13 7.5v15L32 35l-13-7.5v-15L32 5Z" />
      <path d="m19 27.5-13 7.5v15l13 7.5L32 50V35L19 27.5Zm26 0L32 35v15l13 7.5L58 50V35l-13-7.5ZM19 12.5 32 20l13-7.5M32 20v15M6 35l13 7.5L32 35m0 0 13 7.5L58 35M19 42.5v15m26-15v15" />
    </svg>
  );
}

function AiIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="12" y="12" width="40" height="40" rx="6" />
      <path d="M21 4v8M32 4v8M43 4v8M21 52v8M32 52v8M43 52v8M4 21h8M4 32h8M4 43h8M52 21h8M52 32h8M52 43h8" />
      <path d="m23 41 5-18h4l5 18m-12.5-6h11M42 23v18" />
    </svg>
  );
}

function CloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 49h29.5A11.5 11.5 0 0 0 50 26.3 17 17 0 0 0 18 21a14 14 0 0 0 0 28Z" />
    </svg>
  );
}

function EngineeringIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="11" y="10" width="42" height="32" rx="1" />
      <path d="M11 42 5 51h54l-6-9H11Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .8a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.06-.72.08-.71.08-.71 1.16.08 1.78 1.19 1.78 1.19 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.28 5.68.42.36.79 1.06.79 2.14v3.19c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .8Z"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.4 7.7H1.8V22h3.6V7.7ZM3.6 2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM22 13.8c0-4.3-2.3-6.4-5.4-6.4a4.7 4.7 0 0 0-4.2 2.3h-.1v-2H8.8V22h3.6v-7.1c0-1.9.4-3.7 2.7-3.7 2.3 0 2.3 2.1 2.3 3.8v7H22v-8.2Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="21" rx="1.5" />
      <path d="m2 3 14 11L30 3M2 21l10-10m18 10L20 11" />
    </svg>
  );
}

const focusAreas = [
  {
    title: "Technology Transformation",
    description: "Turning complexity into impact",
    Icon: TransformationIcon,
  },
  {
    title: "Artificial Intelligence",
    description: "From exploration to real-world value",
    Icon: AiIcon,
  },
  {
    title: "Cloud Strategy",
    description: "From vision to scalable solutions",
    Icon: CloudIcon,
  },
  {
    title: "Engineering",
    description: "Hands-on, pragmatic, scalable",
    Icon: EngineeringIcon,
  },
] as const;

export default function App() {
  return (
    <main className="page-grid" id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Manuel Oswald</p>
        <h1 id="hero-title">
          Enterprise Transformation,
          <br />
          Technology Strategy
          <br />
          and AI &amp; Cloud
        </h1>
        <p className="hero-copy">
          I work at the intersection of technology, business and execution — combining strategic
          thinking with a strong technical background and a passion for building things.
        </p>
      </section>

      <section className="focus" aria-labelledby="focus-title">
        <h2 className="eyebrow" id="focus-title">
          Focus Areas
        </h2>
        <div className="focus-list">
          {focusAreas.map(({ title, description, Icon }) => (
            <article className="focus-item" key={title}>
              <Icon className="focus-icon" />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial editorial--beyond" aria-labelledby="beyond-title">
        <p className="eyebrow">Beyond Work</p>
        <h2 id="beyond-title">
          Technology, making,{" "}
          <br />
          sailing and exploring.
        </h2>
        <p>
          Outside of work I enjoy building things, sailing, travelling and experimenting with new
          ideas — from software and AI to 3D printing, electronics and home automation.
        </p>
      </section>

      <section className="editorial editorial--about" aria-labelledby="about-title">
        <p className="eyebrow">About Me</p>
        <h2 id="about-title">
          Curious, active{" "}
          <br />
          and always learning.
        </h2>
        <p>
          I value freedom, continuous learning and creating a life that blends meaningful work with
          time for family, adventure and the things I genuinely enjoy.
        </p>
      </section>

      <footer className="footer">
        <nav className="legal-links" aria-label="Legal">
          <a href="./imprint.html">Imprint</a>
          <a href="./privacy.html">Privacy</a>
        </nav>
        <nav className="social-links" aria-label="Social and contact links">
          <a href={links.github} aria-label="GitHub profile">
            <GithubIcon />
          </a>
          <a href={links.linkedin} aria-label="LinkedIn profile">
            <LinkedinIcon />
          </a>
          <a href={links.email} aria-label="Send email">
            <EmailIcon />
          </a>
        </nav>
      </footer>
    </main>
  );
}
