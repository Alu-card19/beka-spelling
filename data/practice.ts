import { Section } from '@/lib/questions'
import { KG1_WORDS, KG2_WORDS, PRE_ELEMENTARY_WORDS, GRADE2_WORDS, GRADE3_WORDS, GRADE4_WORDS } from './other-classes-words'
import { GRADE5_WORDS as GRADE5_SPECIAL_WORDS } from './grade5-words'
import { GRADE1_WORDS as GRADE1_SPECIAL_WORDS } from './grade1-words'

export interface PracticeSeed {
  section: Section
  category: 'Spelling Bee'
  question: string
  answer: string
  hint?: string
  sentence?: string
}

// Deduplicate: keep first occurrence per section
function deduplicateByWord(words: any[]): any[] {
  const seen = new Map<string, Set<string>>()
  return words.filter(w => {
    const key = w.section
    if (!seen.has(key)) seen.set(key, new Set())
    const sectionSet = seen.get(key)!
    if (sectionSet.has(w.word)) return false
    sectionSet.add(w.word)
    return true
  })
}

function wordToAnswer(word: string): string {
  return word.split(' ').map((part: string) => part.split('').join('-')).join(' / ')
}

const allWords = deduplicateByWord([
  ...KG1_WORDS,
  ...KG2_WORDS,
  ...PRE_ELEMENTARY_WORDS,
  ...GRADE1_SPECIAL_WORDS,
  ...GRADE2_WORDS,
  ...GRADE3_WORDS,
  ...GRADE4_WORDS,
  ...GRADE5_SPECIAL_WORDS,
])

export const defaultPracticeQuestions: PracticeSeed[] = allWords.map(w => ({
  section: w.section as Section,
  category: 'Spelling Bee' as const,
  question: w.word.toUpperCase(),
  answer: wordToAnswer(w.word),
  hint: w.hint,
  sentence: w.sentence,
}))
