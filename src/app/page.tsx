import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) 1.5rem',
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
            marginBottom: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          Find your next escape
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--muted)',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          Book handpicked resorts with a single search. Simple, transparent, and stress-free.
        </p>
        <Link
          href="/resorts"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--foreground)',
            color: '#fff',
            borderRadius: 6,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Browse resorts
        </Link>
      </section>
    </main>
  );
}
