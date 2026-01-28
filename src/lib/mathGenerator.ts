export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MathQuestion {
  display: string
  correctAnswer: number
  options: number[]
  operation: '+' | '-' | '×'
}

interface DifficultyConfig {
  additionRange: { min: number; max: number }
  subtractionRange: { min: number; max: number }
  multiplicationRange: { min: number; max: number }
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    additionRange: { min: 1, max: 20 },
    subtractionRange: { min: 5, max: 20 },
    multiplicationRange: { min: 2, max: 5 }
  },
  medium: {
    additionRange: { min: 10, max: 50 },
    subtractionRange: { min: 10, max: 50 },
    multiplicationRange: { min: 2, max: 10 }
  },
  hard: {
    additionRange: { min: 25, max: 100 },
    subtractionRange: { min: 25, max: 100 },
    multiplicationRange: { min: 5, max: 15 }
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function generateQuestion(difficulty: Difficulty = 'medium'): MathQuestion {
  const operations: Array<'+' | '-' | '×'> = ['+', '-', '×']
  const operation = operations[getRandomInt(0, 2)]
  const config = DIFFICULTY_CONFIGS[difficulty]
  
  let num1: number
  let num2: number
  let correctAnswer: number
  let display: string

  switch (operation) {
    case '+':
      num1 = getRandomInt(config.additionRange.min, config.additionRange.max)
      num2 = getRandomInt(config.additionRange.min, config.additionRange.max)
      correctAnswer = num1 + num2
      display = `${num1} + ${num2}`
      break
    
    case '-':
      num1 = getRandomInt(config.subtractionRange.min, config.subtractionRange.max)
      num2 = getRandomInt(1, num1)
      correctAnswer = num1 - num2
      display = `${num1} - ${num2}`
      break
    
    case '×':
      num1 = getRandomInt(config.multiplicationRange.min, config.multiplicationRange.max)
      num2 = getRandomInt(config.multiplicationRange.min, config.multiplicationRange.max)
      correctAnswer = num1 * num2
      display = `${num1} × ${num2}`
      break
  }

  const wrongAnswers = new Set<number>()
  
  while (wrongAnswers.size < 3) {
    let wrongAnswer: number
    
    if (operation === '×') {
      const offset = getRandomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1)
      wrongAnswer = correctAnswer + offset * getRandomInt(1, num1)
    } else {
      const offset = getRandomInt(1, 10)
      wrongAnswer = correctAnswer + (Math.random() > 0.5 ? offset : -offset)
    }
    
    if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
      wrongAnswers.add(wrongAnswer)
    }
  }

  const options = shuffleArray([correctAnswer, ...Array.from(wrongAnswers)])

  return {
    display,
    correctAnswer,
    options,
    operation
  }
}
