'use client'

/**
 * Local data layer using localStorage.
 * All data is stored on the device only.
 */

import { Section, Category } from './questions'
import { defaultQuestions } from '@/data/questions'
import { defaultPracticeQuestions } from '@/data/practice'
import { defaultSpellingWords } from '@/data/spelling-words'

const STORAGE_KEYS = {
  questions: 'beka_questions_v2',
  practice: 'beka_practice_v2',
  spelling_words: 'beka_spelling_words_v2',
  leaderboard: 'beka_leaderboard',
  spelling_scores: 'beka_spelling_scores',
  seed_version: 'beka_seed_version',
}

const CURRENT_SEED_VERSION = 3

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface Question {
  id: string
  section: string
  category: Category
  question: string
  answer: string
  difficulty?: string
  hint?: string
  sentence?: string
  created_at: string
}

export interface PracticeQuestion {
  id: string
  section: Section
  category: Category
  question: string
  answer: string
  hint: string
  sentence?: string
  created_at: string
}

export interface SpellingWord {
  id: string
  word: string
  section: string
  hint: string | null
  sentence?: string
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  team_name: string
  section: string
  score: number
  wins: number
  created_at: string
}

export interface SpellingScore {
  id: string
  player_name: string
  section: string
  category: string
  score: number
  total: number
  percentage: number
  created_at: string
}

// ─────────────────────────────────────────────────────────────
// Utility: SSR Guard
// ─────────────────────────────────────────────────────────────

function getStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
}

// ─────────────────────────────────────────────────────────────
// Questions
// ─────────────────────────────────────────────────────────────

function initializeQuestions() {
  const storage = getStorage()
  const currentVersion = parseInt(storage.getItem(STORAGE_KEYS.seed_version) || '0')
  
  // Only re-seed if version changed
  if (currentVersion === CURRENT_SEED_VERSION && storage.getItem(STORAGE_KEYS.questions)) return

  const records: Question[] = defaultQuestions.map(q => ({
    id: crypto.randomUUID(),
    section: q.section,
    category: q.category,
    question: q.question,
    answer: q.answer,
    difficulty: q.difficulty,
    hint: q.hint,
    sentence: q.sentence,
    created_at: new Date().toISOString(),
  }))

  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(records))
  storage.setItem(STORAGE_KEYS.seed_version, String(CURRENT_SEED_VERSION))
}

export async function getQuestions(section: string, category: Category): Promise<Question[]> {
  if (typeof window === 'undefined') return []
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions)
  if (!data) return []

  const questions: Question[] = JSON.parse(data)
  return questions
    .filter(q => q.section === section && q.category === category)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export async function getAllForSection(section: string): Promise<Record<string, Question[]>> {
  if (typeof window === 'undefined') return {}
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions)
  if (!data) return {}

  const questions: Question[] = JSON.parse(data)
  const filtered = questions
    .filter(q => q.section === section)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const grouped: Record<string, Question[]> = {}
  for (const q of filtered) {
    if (!grouped[q.category]) grouped[q.category] = []
    grouped[q.category].push(q)
  }
  return grouped
}

export async function getQuestionsByDifficulty(
  section: string,
  difficulty: string,
  category: string
): Promise<Question[]> {
  if (typeof window === 'undefined') return []
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions)
  if (!data) return []

  const questions: Question[] = JSON.parse(data)
  return questions
    .filter(q => q.section === section && q.difficulty === difficulty && q.category === category)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export async function addQuestion(q: {
  section: string
  category: Category
  question: string
  answer: string
  difficulty?: string
  hint?: string
}): Promise<void> {
  if (typeof window === 'undefined') return
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions) || '[]'
  const questions: Question[] = JSON.parse(data)

  questions.push({
    id: crypto.randomUUID(),
    ...q,
    created_at: new Date().toISOString(),
  })

  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(questions))
}

export async function updateQuestion(
  id: string,
  question: string,
  answer: string,
  difficulty?: string,
  hint?: string
): Promise<void> {
  if (typeof window === 'undefined') return
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions) || '[]'
  const questions: Question[] = JSON.parse(data)

  const idx = questions.findIndex(q => q.id === id)
  if (idx === -1) throw new Error('Question not found')

  questions[idx] = { ...questions[idx], question, answer, difficulty, hint }
  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(questions))
}

export async function deleteQuestion(id: string): Promise<void> {
  if (typeof window === 'undefined') return
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions) || '[]'
  const questions: Question[] = JSON.parse(data)

  const filtered = questions.filter(q => q.id !== id)
  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(filtered))
}

export async function bulkInsertQuestions(questions: Omit<Question, 'id' | 'created_at'>[]): Promise<void> {
  if (typeof window === 'undefined') return
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions) || '[]'
  const existing: Question[] = JSON.parse(data)

  const newRecords: Question[] = questions.map(q => ({
    id: crypto.randomUUID(),
    ...q,
    created_at: new Date().toISOString(),
  }))

  existing.push(...newRecords)
  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(existing))
}

export async function updateQuestionDifficulty(ids: string[], difficulty: string): Promise<void> {
  if (typeof window === 'undefined') return
  initializeQuestions()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.questions) || '[]'
  const questions: Question[] = JSON.parse(data)

  const idSet = new Set(ids)
  const updated = questions.map(q => (idSet.has(q.id) ? { ...q, difficulty } : q))

  storage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated))
}

// ─────────────────────────────────────────────────────────────
// Practice Questions
// ─────────────────────────────────────────────────────────────

function initializePractice() {
  const storage = getStorage()
  const currentVersion = parseInt(storage.getItem(STORAGE_KEYS.seed_version) || '0')
  
  // Only re-seed if version changed
  if (currentVersion === CURRENT_SEED_VERSION && storage.getItem(STORAGE_KEYS.practice)) return

  const records: PracticeQuestion[] = defaultPracticeQuestions.map(q => ({
    id: crypto.randomUUID(),
    section: q.section,
    category: q.category,
    question: q.question,
    answer: q.answer,
    hint: q.hint || '',
    sentence: q.sentence,
    created_at: new Date().toISOString(),
  }))

  storage.setItem(STORAGE_KEYS.practice, JSON.stringify(records))
  storage.setItem(STORAGE_KEYS.seed_version, String(CURRENT_SEED_VERSION))
}

export async function getPracticeQuestions(
  section: Section,
  category: Category
): Promise<PracticeQuestion[]> {
  if (typeof window === 'undefined') return []
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const questions: PracticeQuestion[] = JSON.parse(data)

  const filtered = questions.filter(q => q.section === section && q.category === category)

  // Fisher-Yates shuffle
  const shuffled = [...filtered]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, 20) // Limit to 20
}

export async function getAllPracticeQuestions(
  section: Section,
  category: Category
): Promise<PracticeQuestion[]> {
  if (typeof window === 'undefined') return []
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const questions: PracticeQuestion[] = JSON.parse(data)

  return questions
    .filter(q => q.section === section && q.category === category)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export async function addPracticeQuestion(q: {
  section: Section
  category: Category
  question: string
  answer: string
  hint?: string
}): Promise<void> {
  if (typeof window === 'undefined') return
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const questions: PracticeQuestion[] = JSON.parse(data)

  questions.push({
    id: crypto.randomUUID(),
    ...q,
    hint: q.hint ?? '',
    created_at: new Date().toISOString(),
  })

  storage.setItem(STORAGE_KEYS.practice, JSON.stringify(questions))
}

export async function updatePracticeQuestion(
  id: string,
  question: string,
  answer: string,
  hint: string
): Promise<void> {
  if (typeof window === 'undefined') return
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const questions: PracticeQuestion[] = JSON.parse(data)

  const idx = questions.findIndex(q => q.id === id)
  if (idx === -1) throw new Error('Practice question not found')

  questions[idx] = { ...questions[idx], question, answer, hint }
  storage.setItem(STORAGE_KEYS.practice, JSON.stringify(questions))
}

export async function deletePracticeQuestion(id: string): Promise<void> {
  if (typeof window === 'undefined') return
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const questions: PracticeQuestion[] = JSON.parse(data)

  const filtered = questions.filter(q => q.id !== id)
  storage.setItem(STORAGE_KEYS.practice, JSON.stringify(filtered))
}

export async function bulkInsertPracticeQuestions(
  questions: Omit<PracticeQuestion, 'id' | 'created_at'>[]
): Promise<void> {
  if (typeof window === 'undefined') return
  initializePractice()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.practice) || '[]'
  const existing: PracticeQuestion[] = JSON.parse(data)

  const newRecords: PracticeQuestion[] = questions.map(q => ({
    id: crypto.randomUUID(),
    ...q,
    created_at: new Date().toISOString(),
  }))

  existing.push(...newRecords)
  storage.setItem(STORAGE_KEYS.practice, JSON.stringify(existing))
}

// ─────────────────────────────────────────────────────────────
// Spelling Words
// ─────────────────────────────────────────────────────────────

function initializeSpellingWords() {
  const storage = getStorage()
  const currentVersion = parseInt(storage.getItem(STORAGE_KEYS.seed_version) || '0')
  
  // Only re-seed if version changed
  if (currentVersion === CURRENT_SEED_VERSION && storage.getItem(STORAGE_KEYS.spelling_words)) return

  const records: SpellingWord[] = defaultSpellingWords.map(w => ({
    id: crypto.randomUUID(),
    word: w.word,
    section: w.section,
    hint: w.hint || null,
    sentence: w.sentence,
    created_at: new Date().toISOString(),
  }))

  storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(records))
  storage.setItem(STORAGE_KEYS.seed_version, String(CURRENT_SEED_VERSION))
}

export async function getSpellingWords(section: string): Promise<SpellingWord[]> {
  if (typeof window === 'undefined') return []
  initializeSpellingWords()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_words) || '[]'
  const words: SpellingWord[] = JSON.parse(data)

  return words
    .filter(w => w.section === section)
    .sort((a, b) => a.word.localeCompare(b.word))
}

export async function addSpellingWord(w: {
  section: string
  word: string
  hint?: string
}): Promise<void> {
  if (typeof window === 'undefined') return
  initializeSpellingWords()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_words) || '[]'
  const words: SpellingWord[] = JSON.parse(data)

  words.push({
    id: crypto.randomUUID(),
    ...w,
    hint: w.hint || null,
    created_at: new Date().toISOString(),
  })

  storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(words))
}

export async function updateSpellingWord(
  id: string,
  word: string,
  hint: string | null
): Promise<void> {
  if (typeof window === 'undefined') return
  initializeSpellingWords()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_words) || '[]'
  const words: SpellingWord[] = JSON.parse(data)

  const idx = words.findIndex(w => w.id === id)
  if (idx === -1) throw new Error('Spelling word not found')

  words[idx] = { ...words[idx], word, hint }
  storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(words))
}

export async function deleteSpellingWord(id: string): Promise<void> {
  if (typeof window === 'undefined') return
  initializeSpellingWords()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_words) || '[]'
  const words: SpellingWord[] = JSON.parse(data)

  const filtered = words.filter(w => w.id !== id)
  storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(filtered))
}

export async function bulkInsertSpellingWords(
  words: Omit<SpellingWord, 'id' | 'created_at'>[]
): Promise<void> {
  if (typeof window === 'undefined') return
  initializeSpellingWords()

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_words) || '[]'
  const existing: SpellingWord[] = JSON.parse(data)

  const newRecords: SpellingWord[] = words.map(w => ({
    id: crypto.randomUUID(),
    ...w,
    created_at: new Date().toISOString(),
  }))

  existing.push(...newRecords)
  storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(existing))
}

// ─────────────────────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────────────────────

export async function getLeaderboard(section?: string): Promise<LeaderboardEntry[]> {
  if (typeof window === 'undefined') return []

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.leaderboard) || '[]'
  const entries: LeaderboardEntry[] = JSON.parse(data)

  let filtered = entries
  if (section && section !== 'All') {
    filtered = filtered.filter(e => e.section === section)
  }

  return filtered.sort((a, b) => b.score - a.score)
}

export async function upsertScore(args: {
  teamName: string
  section: string
  addScore: number
  addWin: boolean
}): Promise<void> {
  if (typeof window === 'undefined') return

  const { teamName, section, addScore, addWin } = args

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.leaderboard) || '[]'
  const entries: LeaderboardEntry[] = JSON.parse(data)

  const existing = entries.find(e => e.team_name === teamName && e.section === section)

  if (existing) {
    existing.score += addScore
    existing.wins += addWin ? 1 : 0
  } else {
    entries.push({
      id: crypto.randomUUID(),
      team_name: teamName,
      section,
      score: addScore,
      wins: addWin ? 1 : 0,
      created_at: new Date().toISOString(),
    })
  }

  storage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(entries))
}

export async function resetLeaderboard(section?: string): Promise<void> {
  if (typeof window === 'undefined') return

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.leaderboard) || '[]'
  let entries: LeaderboardEntry[] = JSON.parse(data)

  if (section) {
    entries = entries.filter(e => e.section !== section)
  } else {
    entries = []
  }

  storage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(entries))
}

// ─────────────────────────────────────────────────────────────
// Spelling Scores
// ─────────────────────────────────────────────────────────────

export async function saveSpellingScore(s: {
  player_name: string
  section: string
  category: string
  score: number
  total: number
  percentage: number
}): Promise<void> {
  if (typeof window === 'undefined') return

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_scores) || '[]'
  const scores: SpellingScore[] = JSON.parse(data)

  scores.push({
    id: crypto.randomUUID(),
    ...s,
    created_at: new Date().toISOString(),
  })

  storage.setItem(STORAGE_KEYS.spelling_scores, JSON.stringify(scores))
}

export async function getSpellingScores(
  section?: string,
  playerName?: string
): Promise<SpellingScore[]> {
  if (typeof window === 'undefined') return []

  const storage = getStorage()
  const data = storage.getItem(STORAGE_KEYS.spelling_scores) || '[]'
  let scores: SpellingScore[] = JSON.parse(data)

  if (section) {
    scores = scores.filter(s => s.section === section)
  }
  if (playerName) {
    scores = scores.filter(s => s.player_name === playerName)
  }

  return scores.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// ─────────────────────────────────────────────────────────────
// Backup & Reset
// ─────────────────────────────────────────────────────────────

export function exportBackup(): string {
  if (typeof window === 'undefined') return ''

  const storage = getStorage()
  const backup = {
    questions: JSON.parse(storage.getItem(STORAGE_KEYS.questions) || '[]'),
    practice: JSON.parse(storage.getItem(STORAGE_KEYS.practice) || '[]'),
    spelling_words: JSON.parse(storage.getItem(STORAGE_KEYS.spelling_words) || '[]'),
    leaderboard: JSON.parse(storage.getItem(STORAGE_KEYS.leaderboard) || '[]'),
    spelling_scores: JSON.parse(storage.getItem(STORAGE_KEYS.spelling_scores) || '[]'),
  }

  return JSON.stringify(backup, null, 2)
}

export function importBackup(jsonStr: string): void {
  if (typeof window === 'undefined') return

  const backup = JSON.parse(jsonStr)
  const storage = getStorage()

  if (backup.questions) storage.setItem(STORAGE_KEYS.questions, JSON.stringify(backup.questions))
  if (backup.practice) storage.setItem(STORAGE_KEYS.practice, JSON.stringify(backup.practice))
  if (backup.spelling_words)
    storage.setItem(STORAGE_KEYS.spelling_words, JSON.stringify(backup.spelling_words))
  if (backup.leaderboard) storage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(backup.leaderboard))
  if (backup.spelling_scores)
    storage.setItem(STORAGE_KEYS.spelling_scores, JSON.stringify(backup.spelling_scores))
}

export function resetToDefaults(): void {
  if (typeof window === 'undefined') return

  const storage = getStorage()
  storage.removeItem(STORAGE_KEYS.questions)
  storage.removeItem(STORAGE_KEYS.practice)
  storage.removeItem(STORAGE_KEYS.spelling_words)

  // Re-initialize
  initializeQuestions()
  initializePractice()
  initializeSpellingWords()
}

export function deleteAllData(): void {
  if (typeof window === 'undefined') return

  const storage = getStorage()
  storage.removeItem(STORAGE_KEYS.questions)
  storage.removeItem(STORAGE_KEYS.practice)
  storage.removeItem(STORAGE_KEYS.spelling_words)
  storage.removeItem(STORAGE_KEYS.leaderboard)
  storage.removeItem(STORAGE_KEYS.spelling_scores)
}
