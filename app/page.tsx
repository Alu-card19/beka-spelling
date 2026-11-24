import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

const SECTIONS = [
  { name: 'Buzzing Buds',      emoji: '🌱', label: 'Buzzing Buds',      grades: 'KG 1' },
  { name: 'Busy Bees',         emoji: '🐝', label: 'Busy Bees',         grades: 'KG 2' },
  { name: 'Honey Hunters',     emoji: '🍯', label: 'Honey Hunters',     grades: 'Pre-Elementary' },
  { name: 'Word Explorers',    emoji: '🧭', label: 'Word Explorers',    grades: 'Grade 1' },
  { name: 'Spelling Stars',    emoji: '⭐', label: 'Spelling Stars',    grades: 'Grade 2' },
  { name: 'Letter Legends',    emoji: '🔤', label: 'Letter Legends',    grades: 'Grade 3' },
  { name: 'Word Wizards',      emoji: '🧙', label: 'Word Wizards',      grades: 'Grade 4' },
  { name: 'Grand Spellmasters', emoji: '👑', label: 'Grand Spellmasters', grades: 'Grade 5' },
]

export default function HomePage() {
  return (
    <div className={styles.hero}>
      {/* School identity */}
      <div className={styles.identity}>
        <Image src="/logo.jpg" alt="BEKA Academy"
          width={120} height={120} className={styles.logo} priority />
        <div className={styles.identityText}>
          <h1 className={styles.school1}>BEKA Academy</h1>
          <p className={styles.motto}>Making a Difference, One Child at a Time</p>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.appTitle}>Spelling Bee Championship</p>

      <div className={styles.grid}>
        {SECTIONS.map(s => (
          <Link key={s.name} href={`/setup?section=${encodeURIComponent(s.name)}`} className={styles.card}>
            <span className={styles.cardIcon}>{s.emoji}</span>
            <span className={styles.cardName}>{s.label}</span>
            <span className={styles.cardGrades}>{s.grades}</span>
          </Link>
        ))}
      </div>

      <div className={styles.cta}>
        <Link href="/setup" className="btn btn-primary btn-lg">🚀 Start Quiz</Link>
        <Link href="/leaderboard" className="btn btn-ghost">🏆 Leaderboard</Link>
      </div>

      {/* Spelling Game CTA */}
      <div className={styles.spellingCta}>
        <Link href="/spelling" className={styles.spellingCard}>
          <span className={styles.spellingIcon}>🔤</span>
          <div className={styles.spellingText}>
            <span className={styles.spellingTitle}>Spelling Game</span>
            <span className={styles.spellingDesc}>Hear it · Spell it · Beat the clock</span>
          </div>
          <span className={styles.spellingArrow}>→</span>
        </Link>
      </div>
    </div>
  )
}
