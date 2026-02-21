export default function Page() {
  return (
    <main>
      <section
        style={{
          padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem 1.5rem',
          textAlign: 'center',
          maxWidth: 640,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}
        >
          Find your next escape
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--muted)',
            marginBottom: '0',
            lineHeight: 1.6,
          }}
        >
          Book handpicked resorts with a single search. Simple, transparent, and stress-free.
        </p>
      </section>
    </main>
  );
}
