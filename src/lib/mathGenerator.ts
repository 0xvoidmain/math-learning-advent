export interface MathQuestion {
  display: string
  correctAnswer: number
  options: number[]
  operation: '+' | '-' | '×'
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

export function generateQuestion(): MathQuestion {
  const operations: Array<'+' | '-' | '×'> = ['+', '-', '×']
  const operation = operations[getRandomInt(0, 2)]
  
  let num1: number
  let num2: number
  let correctAnswer: number
  let display: string

  switch (operation) {
    case '+':
      num1 = getRandomInt(1, 50)
      num2 = getRandomInt(1, 50)
      correctAnswer = num1 + num2
      display = `${num1} + ${num2}`
      break
    
    case '-':
      num1 = getRandomInt(10, 50)
      num2 = getRandomInt(1, num1)
      correctAnswer = num1 - num2
      display = `${num1} - ${num2}`
      break
    
    case '×':
      num1 = getRandomInt(2, 12)
      num2 = getRandomInt(2, 12)
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
