'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '../../context/ThemeContext'
import styles from './Header.module.css'

const NAV = [
  { href: '/',            label: 'Home' },
  { href: '/setup',       label: 'Solo Quiz' },
  { href: '/practice',    label: '📚 Practice' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/admin',       label: '⚙ Admin' },
]

export default function Header() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <header className={styles.header}>
      {/* School branding */}
      <Link href="/" className={styles.brand}>
        <div className={styles.logoRing}>
          <Image
            src="/logo.jpg"
            alt="BEKA Academy"
            width={48}
            height={48}
            className={styles.logoImg}
            priority
          />
        </div>
        <div className={styles.brandText}>
          <span className={styles.schoolName}>BEKA Academy</span>
          <span className={styles.quizBadge}>Spelling Bee Championship</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(n => (
          <Link
            key={n.href}
            href={n.href}
            className={`${styles.link} ${pathname === n.href ? styles.active : ''}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Theme toggle */}
      <button className={styles.themeBtn} onClick={toggle} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
