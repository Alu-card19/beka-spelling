'use client'

/**
 * /spelling/leaderboard — Spelling Bee leaderboard.
 * Tabs: This Week / This Month / All Time
 * Section filter dropdown
 * Table: Rank, Name, Section, Score, Best Streak
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getSpellingScores } from '@/lib/db'
import { SECTIONS } from '@/lib/questions'
import styles from './page.module.css'

type TimeFilter = 'week' | 'month' | 'all'

interface SpellingScoreRow {
  id: string
  player_name: string
  section: string
  score: number
  total: number
  percentage: number
  created_at: string
}

const SECTION_FILTERS = ['All Sections', ...SECTIONS]
const RANK_MEDALS     = ['🥇', '🥈', '🥉']

function getDateCutoff(filter: TimeFilter): Date | null {
  if (filter === 'all') return null
  const d = new Date()
  if (filter === 'week')  d.setDate(d.getDate() - 7)
  if (filter === 'month') d.setMonth(d.getMonth() - 1)
  return d
}

export default function SpellingLeaderboardPage() {
  const [timeFilter,    setTimeFilter]    = useState<TimeFilter>('week')
  const [sectionFilter, setSectionFilter] = useState('All Sections')
  const [scores,        setScores]        = useState<SpellingScoreRow[]>([])
  const [loading,       setLoading]       = useState(true)

  const loadScores = useCallback(async () => {
    setLoading(true)

    let allScores = await getSpellingScores(sectionFilter !== 'All Sections' ? sectionFilter : undefined)
    
    const cutoff = getDateCutoff(timeFilter)
    if (cutoff) {
      allScores = allScores.filter(s => new Date(s.created_at) >= cutoff)
    }

    setScores(allScores.slice(0, 50))
    setLoading(false)
  }, [timeFilter, sectionFilter])

  useEffect(() => { loadScores() }, [loadScores])

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/spelling" className="btn btn-ghost btn-sm">← Back</Link>
        </div>
        <h1 className={styles.title}>🏆 Spelling Leaderboard</h1>
        <div className={styles.headerRight} />
      </div>

      {/* Notice */}
      <div style={{
        width: '100%',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        border: '1px solid #00e5ff',
        borderRadius: '4px',
        padding: '12px 16px',
        marginBottom: '16px',
        color: '#fff',
        fontSize: '0.9rem',
      }}>
        💾 Scores are saved on this device only. Export a backup from Admin to keep your data safe.
      </div>

      {/* Time filter tabs */}
      <div className={styles.timeFilters}>
        {(['week', 'month', 'all'] as TimeFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`${styles.timeFb} ${timeFilter === f ? styles.timeActive : ''}`}
          >
            {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Section filter */}
      <div className={styles.sectionFilter}>
        <select
          value={sectionFilter}
          onChange={e => setSectionFilter(e.target.value)}
          className={styles.sectionSelect}
        >
          {SECTION_FILTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : scores.length === 0 ? (
        <div className={styles.empty}>
          <p>No scores yet for this filter.</p>
          <Link href="/spelling/page" className="btn btn-gold btn-sm" style={{ marginTop: 16 }}>
            Be the first! Play now →
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Section</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((row, i) => (
                <tr key={row.id} className={i === 0 ? styles.firstRow : ''}>
                  <td>{RANK_MEDALS[i] ?? i + 1}</td>
                  <td><strong>{row.player_name}</strong></td>
                  <td><span className={styles.sectionTag}>{row.section}</span></td>
                  <td><strong className={styles.scoreVal}>{row.percentage}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
