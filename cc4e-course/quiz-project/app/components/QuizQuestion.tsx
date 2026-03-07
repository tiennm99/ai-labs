type Option = {
  text: string;
  personality: 'zen' | 'nightOwl' | 'socialButterfly';
};

type Props = {
  question: string;
  options: Option[];
  current: number;
  total: number;
  onSelect: (personality: Option['personality']) => void;
};

export default function QuizQuestion({ question, options, current, total, onSelect }: Props) {
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
      {/* Progress */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}>
          <span style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
            Your Coffee Personality
          </span>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            {current} of {total}
          </span>
        </div>
        <div style={{ height: '3px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(current / total) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent), #a0785a)',
            borderRadius: '99px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <h2 style={{
        fontSize: '22px',
        fontWeight: 500,
        lineHeight: 1.4,
        color: 'var(--foreground)',
        marginBottom: '28px',
      }}>
        {question}
      </h2>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(option.personality)}
            style={{
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '16px 20px',
              textAlign: 'left',
              fontSize: '15px',
              color: 'var(--foreground)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              width: '100%',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
