export { getQuestions, getAllForSection, getQuestionsByDifficulty, addQuestion, updateQuestion, deleteQuestion, bulkInsertQuestions, updateQuestionDifficulty } from './db'
export type { Question } from './db'

export const SECTIONS = [
  'Buzzing Buds',
  'Busy Bees',
  'Honey Hunters',
  'Word Explorers',
  'Spelling Stars',
  'Letter Legends',
  'Word Wizards',
  'Grand Spellmasters',
] as const

export type Section = typeof SECTIONS[number]

export const CATEGORIES = ['Spelling Bee'] as const
export type Category = typeof CATEGORIES[number]

export const CATEGORY_ICONS: Record<Category, string> = {
  'Spelling Bee': '🐝',
}
