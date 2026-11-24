export { getPracticeQuestions, getAllPracticeQuestions, addPracticeQuestion, updatePracticeQuestion, deletePracticeQuestion, bulkInsertPracticeQuestions } from './db'
export type { PracticeQuestion } from './db'
import { Section, Category } from './questions'

const PRACTICE_LIMIT = 20

// Re-export for backwards compatibility

