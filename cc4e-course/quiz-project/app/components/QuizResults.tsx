type PersonalityKey = 'zen' | 'nightOwl' | 'socialButterfly';

type Scores = Record<PersonalityKey, number>;

type Props = {
  scores: Scores;
  onReset: () => void;
};

const personalities: Record<PersonalityKey, { name: string; coffee: string; tagline: string }> = {
  zen: {
    name: 'Zen Minimalist',
    coffee: 'Black Coffee, Single Origin',
    tagline: 'Simple. Clean. Perfect.',
  },
  nightOwl: {
    name: 'Night Owl',
    coffee: 'Red Eye',
    tagline: 'Sleep is optional.',
  },
  socialButterfly: {
    name: 'Social Butterfly',
    coffee: 'Cappuccino',
    tagline: 'Coffee is better with company.',
  },
};

export default function QuizResults({ scores, onReset }: Props) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const ranked = (Object.keys(scores) as PersonalityKey[])
    .map(key => ({
      key,
      count: scores[key],
      pct: Math.round((scores[key] / total) * 100),
      ...personalities[key],
    }))
    .sort((a, b) => b.count - a.count);

  const top = ranked[0];

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: '20px',
      padding: '48px 44px',
      boxShadow: '0 4px 24px rgba(61, 43, 26, 0.08)',
      border: '1px solid var(--border)',
      maxWidth: '520px',
      width: '100%',
    }}>
      <span style={{
        fontSize: '12px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        fontWeight: 600,
      }}>
        Your Result
      </span>

      {/* Top result */}
      <div style={{
        margin: '20px 0 36px',
        padding: '28px',
        background: 'var(--accent-light)',
        border: '1.5px solid var(--accent)',
        borderRadius: '16px',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 500 }}>
          You&apos;re a
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px', lineHeight: 1.2 }}>
          {top.name}
        </h2>
        <div style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 500, marginBottom: '14px' }}>
          {top.pct}% match
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2px' }}>Your coffee</div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '4px' }}>
            {top.coffee}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic' }}>
            &ldquo;{top.tagline}&rdquo;
          </div>
        </div>
      </div>

      {/* All results */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.5px' }}>
          Full breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ranked.map((p, i) => (
            <div key={p.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>{p.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '8px' }}>— {p.coffee}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}>
                  {p.pct}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${p.pct}%`,
                  background: i === 0 ? 'linear-gradient(90deg, var(--accent), #a0785a)' : 'var(--border)',
                  borderRadius: '99px',
                  transition: 'width 0.6s ease',
                  opacity: i === 0 ? 1 : 0.5,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          width: '100%',
          padding: '14px',
          border: '1.5px solid var(--border)',
          borderRadius: '12px',
          background: 'transparent',
          fontSize: '15px',
          color: 'var(--muted)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
        }}
      >
        Take it again
      </button>
    </div>
  );
}
