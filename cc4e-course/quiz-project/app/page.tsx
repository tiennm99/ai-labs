'use client';

import { useState } from 'react';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';

type PersonalityKey = 'zen' | 'nightOwl' | 'socialButterfly';
type Stage = 'intro' | 'quiz' | 'results';

const questions = [
  {
    question: 'Pick a Netflix genre for tonight:',
    options: [
      { text: 'A dark, quiet thriller with no jump scares', personality: 'zen' as PersonalityKey },
      { text: "A binge-worthy series you'll watch until 3am", personality: 'nightOwl' as PersonalityKey },
      { text: 'Whatever your group chat is hyped about', personality: 'socialButterfly' as PersonalityKey },
    ],
  },
  {
    question: 'Your Hogwarts common room vibe:',
    options: [
      { text: 'Ravenclaw — books, focus, solitude', personality: 'zen' as PersonalityKey },
      { text: 'Slytherin — ambition, late nights, no rules', personality: 'nightOwl' as PersonalityKey },
      { text: "Hufflepuff — warm, inclusive, everyone's welcome", personality: 'socialButterfly' as PersonalityKey },
    ],
  },
  {
    question: "You're at a party. Where are you?",
    options: [
      { text: 'Stepped outside for some quiet', personality: 'zen' as PersonalityKey },
      { text: 'Still there at 2am helping close the place down', personality: 'nightOwl' as PersonalityKey },
      { text: 'Center of the room, introducing people to each other', personality: 'socialButterfly' as PersonalityKey },
    ],
  },
  {
    question: 'Your ideal travel style:',
    options: [
      { text: 'Solo trip, minimal itinerary, just vibes', personality: 'zen' as PersonalityKey },
      { text: 'Red-eye flight to maximize time at the destination', personality: 'nightOwl' as PersonalityKey },
      { text: 'Group trip, shared Airbnb, chaotic and perfect', personality: 'socialButterfly' as PersonalityKey },
    ],
  },
  {
    question: 'Pick a superpower:',
    options: [
      { text: 'Total mental clarity, always focused', personality: 'zen' as PersonalityKey },
      { text: 'Never need sleep', personality: 'nightOwl' as PersonalityKey },
      { text: 'Everyone immediately likes you', personality: 'socialButterfly' as PersonalityKey },
    ],
  },
];

const initialScores: Record<PersonalityKey, number> = { zen: 0, nightOwl: 0, socialButterfly: 0 };

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ ...initialScores });

  function handleAnswer(personality: PersonalityKey) {
    const newScores = { ...scores, [personality]: scores[personality] + 1 };
    setScores(newScores);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStage('results');
    }
  }

  function handleReset() {
    setStage('intro');
    setCurrentQ(0);
    setScores({ ...initialScores });
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #faf8f4 0%, #f0e8dc 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          fontWeight: 600,
        }}>
          Basecamp Coffee
        </div>
      </div>

      {stage === 'intro' && (
        <div style={{
          background: 'var(--card)',
          borderRadius: '20px',
          padding: '56px 44px',
          boxShadow: '0 4px 24px rgba(61, 43, 26, 0.08)',
          border: '1px solid var(--border)',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '13px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            Discover your coffee identity
          </div>
          <h1 style={{
            fontSize: '34px',
            fontWeight: 600,
            color: 'var(--foreground)',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            What&apos;s your coffee personality?
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--muted)',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}>
            5 quick questions. We&apos;ll match you with your perfect Basecamp Coffee drink.
          </p>
          <button
            onClick={() => setStage('quiz')}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'opacity 0.18s ease',
              width: '100%',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Find my coffee →
          </button>
        </div>
      )}

      {stage === 'quiz' && (
        <QuizQuestion
          question={questions[currentQ].question}
          options={questions[currentQ].options}
          current={currentQ + 1}
          total={questions.length}
          onSelect={handleAnswer}
        />
      )}

      {stage === 'results' && (
        <QuizResults scores={scores} onReset={handleReset} />
      )}
    </div>
  );
}
