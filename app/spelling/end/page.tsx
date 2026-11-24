'use client'

/**
 * /spelling/end — End screen.
 * Shows final score, percentage.
 * Saves score to localStorage.
 * Options: download certificate, view leaderboard, play again.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveSpellingScore } from '@/lib/db'
import styles from './page.module.css'

export default function SpellingEndPage() {
  const router = useRouter()

  const [playerName, setPlayerName] = useState('')
  const [section,    setSection]    = useState('')
  const [category,   setCategory]   = useState('')
  const [score,      setScore]      = useState(0)
  const [total,      setTotal]      = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [saved,      setSaved]      = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem('spelling_player') ?? ''
    const sec  = sessionStorage.getItem('spelling_section') ?? ''
    const cat  = sessionStorage.getItem('spelling_category') ?? 'Spelling Bee'
    const sc   = parseInt(sessionStorage.getItem('spelling_score')  ?? '0')
    const tot  = parseInt(sessionStorage.getItem('spelling_total')  ?? '0')
    const pct  = parseInt(sessionStorage.getItem('spelling_percent') ?? '0')

    if (!name) { router.replace('/spelling'); return }

    setPlayerName(name)
    setSection(sec)
    setCategory(cat)
    setScore(sc)
    setTotal(tot)
    setPercentage(pct)

    saveScore(name, sec, cat, sc, tot, pct)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveScore(name: string, sec: string, cat: string, sc: number, tot: number, pct: number) {
    await saveSpellingScore({
      player_name: name,
      section: sec,
      category: cat,
      score: sc,
      total: tot,
      percentage: pct,
    })
    setSaved(true)
  }

  function handlePlayAgain() {
    sessionStorage.removeItem('spelling_score')
    sessionStorage.removeItem('spelling_total')
    sessionStorage.removeItem('spelling_percent')
    sessionStorage.removeItem('spelling_streak')
    sessionStorage.removeItem('spelling_accuracy')
    sessionStorage.removeItem('spelling_correct')
    router.push('/spelling/play')
  }

  function handleCertificate() {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const params = new URLSearchParams({
      winner:   playerName,
      score:    String(score),
      section:  section,
      category: 'Spelling Bee',
      date,
    })
    router.push(`/certificate?${params.toString()}`)
  }

  const grade      = percentage >= 90 ? 'S' : percentage >= 70 ? 'A' : percentage >= 50 ? 'B' : percentage >= 30 ? 'C' : 'D'
  const gradeColor = percentage >= 90 ? 'var(--gold)' : percentage >= 70 ? 'var(--green)' : percentage >= 50 ? 'var(--cyan)' : percentage >= 30 ? '#FFA500' : 'var(--red)'
  const emoji      = percentage >= 70 ? '🏆' : percentage >= 40 ? '🎯' : '💪'
  const streak     = 0  // Not tracked in this simplified version
  const correct    = score

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerEmoji}>{emoji}</div>
        <h1 className={styles.title}>GAME OVER</h1>
        <p className={styles.subtitle}>
          Well done, <span style={{ color: 'var(--cyan)', fontWeight: 900 }}>{playerName}</span>!
        </p>
      </div>

      {/* Score card */}
      <div className={styles.card}>

        {/* Grade circle */}
        <div className={styles.gradeWrap}>
          <div className={styles.gradeCircle} style={{ borderColor: gradeColor, color: gradeColor, background: `${gradeColor}18` }}>
            {grade}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem} style={{ '--accent': 'var(--gold)' } as React.CSSProperties}>
            <span className={styles.statNum} style={{ color: 'var(--gold)' }}>{score}</span>
            <span className={styles.statLbl}>Score</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} style={{ color: 'var(--green)' }}>{streak > 0 ? `${streak}🔥` : '0'}</span>
            <span className={styles.statLbl}>Best Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} style={{ color: 'var(--cyan)' }}>{percentage}%</span>
            <span className={styles.statLbl}>Accuracy</span>
          </div>
        </div>

        <p className={styles.summary}>{correct} / 10 words correct · {section}</p>

        {saved && (
          <p className={styles.savedNote}>✓ Score saved to leaderboard</p>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handlePlayAgain} className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
          🔄 PLAY AGAIN
        </button>

        <button onClick={handleCertificate} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
          🏅 Download Certificate
        </button>

        <Link href="/spelling/leaderboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
          🏆 View Leaderboard
        </Link>

        <Link href="/spelling" className={styles.backLink}>
          ← Back to Lobby
        </Link>
      </div>
    </div>
  )
}
