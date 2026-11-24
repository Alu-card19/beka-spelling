import { Section } from '@/lib/questions'
import { KG1_WORDS, KG2_WORDS, PRE_ELEMENTARY_WORDS, GRADE2_WORDS, GRADE3_WORDS, GRADE4_WORDS } from './other-classes-words'
import { GRADE5_WORDS as GRADE5_SPECIAL_WORDS } from './grade5-words'
import { GRADE1_WORDS as GRADE1_SPECIAL_WORDS } from './grade1-words'

export interface SpellingWordSeed {
  section: Section
  word: string
  hint?: string
  sentence?: string
}

// Deduplicate: keep first occurrence per section
function deduplicateByWord(words: SpellingWordSeed[]): SpellingWordSeed[] {
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

export const defaultSpellingWords: SpellingWordSeed[] = deduplicateByWord([
  // All imported lists
  ...KG1_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  ...KG2_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  ...PRE_ELEMENTARY_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  // Grade 1 (Word Explorers)
  ...GRADE1_SPECIAL_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  // Grade 2 (Spelling Stars)
  ...GRADE2_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  // Grade 3 (Letter Legends)
  ...GRADE3_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  // Grade 4 (Word Wizards)
  ...GRADE4_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
  // Grade 5 (Grand Spellmasters)
  ...GRADE5_SPECIAL_WORDS.map(w => ({
    section: w.section as Section,
    word: w.word,
    hint: w.hint,
    sentence: w.sentence,
  })),
])
